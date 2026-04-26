import { getComponentSizeValues } from './helpers/content/size.js';
import { stringifyFactoryIconContent } from './helpers/content/stringify.js';
import type { FactoryIconData } from './types/data.js';
import type { ComponentFactoryOptions } from './types/options.js';
import { stringifyIconViewBox } from '../svg/viewbox/value.js';
import { createFactoryImports } from './helpers/imports/create.js';
import { generateCSSFilesForComponent } from './helpers/css/generate.js';
import type {
	FactoryGeneratedComponent,
	GeneratedAssetFile,
} from './types/component.js';
import type { FactoryComponentProps } from './helpers/props/types.js';
import { addSizeFunctionAsset } from './helpers/functions/size.js';
import { stringifyFactoryPropsAsJSON } from './helpers/props/object.js';
import { stringifyFactoryImports } from './helpers/imports/stringify.js';
import { makeSquareViewBox } from '../svg/viewbox/square.js';
import type { IconViewBox } from '../svg/viewbox/types.js';
import {
	getUsedFactoryProps,
	stringifyFactoryPropTypes,
} from './helpers/props/ts.js';
import { minifyViewBox } from '../svg/viewbox/minify.js';
import { getViewBoxRatio } from './helpers/content/ratio.js';
import { addJSXComponentTypes } from './helpers/ts/jsx.js';
import type { JSXMode } from './types/jsx.js';
import { addCustomFunctionAsset } from './helpers/functions/custom.js';
import { addFallbackFunctionAsset } from './helpers/functions/fallback.js';
import { addInnerHTMLFunctionAsset } from './helpers/functions/innerhtml.js';
import { addReplaceIDsFunctionAsset } from './helpers/functions/ids.js';
import { cleanupJSXRenamedProps } from './helpers/props/cleanup.js';
import { checkForUniqueIDs } from './helpers/code/ids.js';

interface Options extends ComponentFactoryOptions {
	// JSX mode
	jsx: JSXMode;

	// Supported fallback package
	fallbackPackage?: string;

	// Use TypeScript
	ts?: boolean;
}

/**
 * Create React component code
 */
export function createJSXComponent(
	data: FactoryIconData,
	options: Options
): FactoryGeneratedComponent {
	const icon = data.icon;
	const viewBox = icon.viewBox;
	const defaultFallback = icon.defaultFallback;
	const statefulData = icon.statefulData;

	// Check options
	const useTS = options.ts ?? false;

	// Init data
	const assets: GeneratedAssetFile[] = [];
	const imports = createFactoryImports();
	const dependencies = new Set<string>();

	// Modes
	let importPackage = 'react';
	let createElement = 'createElement';

	switch (options.jsx) {
		case 'preact':
			importPackage = 'preact';
			createElement = 'h';
			break;
	}

	// Check if fallback is used
	const fallbackPackage = options.fallbackPackage || null;
	const hasFallback = !!(fallbackPackage && defaultFallback);
	if (hasFallback) {
		imports.named[fallbackPackage] = new Set(['Icon']);
		dependencies.add(fallbackPackage);
	}

	// Add React imports
	const reactNamedImports = new Set([createElement]);
	imports.named[importPackage] = reactNamedImports;

	// Add CSS
	const style = generateCSSFilesForComponent(icon, imports, assets, options);
	const isEmbeddedCSS = options.cssMode === 'embed';

	// Check if size is fixed and if viewBox is computed
	let hasFixedSize = !!options.width && !!options.height;

	const hasComputedViewbox =
		options.square && !hasFixedSize && viewBox.width !== viewBox.height;
	const isStringViewBox = !hasFallback;
	const hasComputedRatio = hasComputedViewbox && isStringViewBox;

	if (!hasComputedViewbox && (options.width || options.height)) {
		// If viewBox is hardcoded and one of width/height is set, size is fixed
		hasFixedSize = true;
	}

	// Get props
	const componentExternalCode: string[] = [];
	const componentInternalCode: string[] = [];
	const props: FactoryComponentProps = {};
	if (!hasFallback) {
		props.xmlns = 'http://www.w3.org/2000/svg';
	}
	props.props = {
		value: 'props',
		template: '...props,',
	};

	// Set stateful props
	let computedFallback = false;
	if (statefulData) {
		const { supportedStates, allStates, staticClassname } = statefulData;
		if (supportedStates.size || staticClassname) {
			const computedStates: string[] = [];
			const computedStateNames: string[] = [];
			let addedStateFunc = false;

			for (const state of allStates) {
				if (typeof state === 'string') {
					// Boolean state
					if (supportedStates.has(state)) {
						props[state] = {
							type: 'boolean',
							value: state,
							template: '',
						};
						computedStates.push(`'${state}': ${state}Prop`);
						computedStateNames.push(state);
					}
				} else {
					// Advanced state
					const stateName = state[0];
					if (supportedStates.has(stateName)) {
						const stateValues = state[1];
						const defaultStateValue = state[2] ?? stateValues[0];

						// Add component property
						props[stateName] = {
							type: stateValues
								.map((value) => `'${value}'`)
								.join(' | '),
							value: stateName,
							template: '',
						};

						// Add to computed state
						computedStates.push(
							`'${stateName}': namedStateValue(${stateName}Prop, '${defaultStateValue}')`
						);
						computedStateNames.push(stateName);
						if (!addedStateFunc) {
							addedStateFunc = true;

							// Create asset for reusable function
							addCustomFunctionAsset(imports, assets, options, {
								functionName: 'namedStateValue',
								content: `export function namedStateValue(value, defaultValue) {
	return value && value !== defaultValue ? value : undefined;
}`,
							});
						}
					}
				}
			}

			if (staticClassname) {
				// Add 'static' as boolean state
				const state = 'static';
				props[state] = {
					type: 'boolean',
					value: state,
					template: '',
				};
				computedStates.push(`'${state}': ${state}Prop`);
				computedStateNames.push(state);
			}

			// Add computed states
			if (computedStates.length) {
				componentInternalCode.push(
					`const states = useMemo(() => ({ ${computedStates.join(', ')} }), [${computedStateNames.map((state) => `${state}Prop`).join(', ')}]);`
				);

				// Compute stateful fallback
				if (hasFallback && statefulData.fallback) {
					computedFallback = true;
					const func = addFallbackFunctionAsset(
						imports,
						assets,
						options,
						statefulData.defaultStateValues
					);
					componentInternalCode.push(
						`const fallback = useMemo(() => ${func}(${JSON.stringify(statefulData.fallback)}, states), [states]);`
					);
				}

				// Compute class name
				componentInternalCode.push(
					`const className = useMemo(() => Object.entries(states).map(([key, value]) => value ? \`state-\${value === true ? key : value}\` : '').join(' ').trim() || undefined, [states]);`
				);
				props['className'] = {
					value: 'className',
					template: `className,`,
				};
			}
		}
	}

	// Compute viewBox
	const getViewBox = (viewBox: IconViewBox) =>
		isStringViewBox
			? `'${stringifyIconViewBox(viewBox)}'`
			: JSON.stringify(minifyViewBox(viewBox));
	if (hasComputedViewbox) {
		// Computed viewBox, based on square prop
		componentExternalCode.push(
			`const baseViewBox = ${getViewBox(viewBox)};`,
			`const squareViewBox = ${getViewBox(makeSquareViewBox(viewBox))};`
		);
		componentInternalCode.push(
			`const viewBox = useMemo(() => squareProp ? squareViewBox : baseViewBox, [squareProp]);`
		);
	} else {
		// Hardcoded viewBox
		componentExternalCode.push(`const viewBox = ${getViewBox(viewBox)};`);
	}

	// Compute width/height ratio
	const ratioValue = getViewBoxRatio(viewBox);
	if (hasComputedRatio) {
		componentInternalCode.push(
			`const ratio = useMemo(() => squareProp ? 1 : ${ratioValue}, [squareProp]);`
		);
	}

	// Set size
	if (hasFixedSize) {
		// Add fixed size props
		const sizeProps = getComponentSizeValues(options, viewBox);
		if (!sizeProps) {
			throw new Error('Fixed size expected, but could not be determined');
		}
		props.width = sizeProps.width;
		props.height = sizeProps.height;
	} else {
		// Computed size props
		if (hasFallback) {
			// Computed size in fallback component
			props.width = {
				type: 'string',
				value: 'width',
				template: 'width: widthProp,',
			};
			props.height = {
				type: 'string',
				value: 'height',
				template: 'height: heightProp,',
			};
		} else {
			// Add computed size and getSizeProps() function
			const getSizeProps = addSizeFunctionAsset(imports, assets, options);
			componentInternalCode.push(
				`const size = useMemo(() => ${getSizeProps}(widthProp, heightProp, ${
					hasComputedRatio ? 'ratio' : ratioValue
				}), [widthProp, heightProp${hasComputedRatio ? ', ratio' : ''}]);`
			);

			// Add width and height props
			props.width = {
				type: 'string',
				value: 'width',
				// Spread computed size
				template: '...size,',
			};
			props.height = {
				type: 'string',
				value: 'height',
				// Included in computed size
				template: '',
			};
		}
	}

	// Prepare content before useMemo check
	let contentTemplate: undefined | string;
	let stringifiedContent = stringifyFactoryIconContent(
		data.icon,
		isEmbeddedCSS ? style : undefined
	);
	const hasDynamicContent =
		!hasFallback && checkForUniqueIDs(stringifiedContent);
	if (hasDynamicContent) {
		// Replace IDs to avoid conflicts when multiple instances are used
		const replaceIDs = addReplaceIDsFunctionAsset(imports, assets, options);
		stringifiedContent = replaceIDs + '(' + stringifiedContent + ')';
	}
	if (!hasFallback) {
		const funcName = addInnerHTMLFunctionAsset(imports, assets, options);
		if (hasDynamicContent) {
			// Unique IDs, so memo for each instance
			componentInternalCode.push(
				`const content = useMemo(() => ({__html: ${funcName}(${stringifiedContent})}), []);`
			);
		} else {
			componentExternalCode.push(
				`const content = {__html: ${funcName}(${stringifiedContent})};`
			);
		}
		contentTemplate = `dangerouslySetInnerHTML: content,`;
	}

	// Add useMemo import if needed
	if (componentInternalCode.some((line) => line.includes('useMemo'))) {
		reactNamedImports.add('useMemo');
	}

	// Add square prop after size props
	if (options.square) {
		props.square = {
			type: 'boolean',
		};
	}

	// Add viewBox prop
	props.viewBox = {
		value: 'viewBox',
		template: 'viewBox,',
	};

	// Add content
	props.content = {
		value: stringifiedContent,
		template: contentTemplate,
	};
	if (hasFallback && defaultFallback) {
		props.fallback = computedFallback
			? {
					value: 'fallback',
					template: 'fallback,',
				}
			: defaultFallback;
	}

	// Add return value to component code
	componentInternalCode.push(
		`return ${createElement}(${hasFallback ? 'Icon' : "'svg'"}, {
\t\t${stringifyFactoryPropsAsJSON(props, '\n\t\t')}
\t});`
	);

	// Generate code before function
	const beforeFunction = componentExternalCode.length
		? componentExternalCode.join('\n') + '\n\n'
		: '';

	// Types
	const propTypes = stringifyFactoryPropTypes(props);
	const typesCode = useTS
		? `interface Props {\n${propTypes}\n};\n\n`
		: propTypes
			? `/** @param {{${propTypes.replace(/\s*\n\s*/g, ' ').trim()}}} */\n`
			: '';

	// Generate component function
	const usedProps = getUsedFactoryProps(props);
	const propsDestricturing = usedProps.length
		? `{${[...usedProps.map((prop) => `${prop}: ${prop}Prop`), '...props'].join(', ')}}`
		: 'props';
	const componentFunction = `${typesCode}function Component(${propsDestricturing}${useTS ? `: Props` : ''}) {
\t${componentInternalCode.join('\n\t')}
}
`;

	// Generate content
	const content = cleanupJSXRenamedProps(
		`${stringifyFactoryImports(
			imports
		)}\n${beforeFunction}${componentFunction}\nexport default Component;\n`
	).trimStart();

	// Add types file
	const types = addJSXComponentTypes(data, options, assets, props);

	// Return data
	return {
		assets,
		content,
		style: isEmbeddedCSS ? undefined : style,
		types,
		dependencies: dependencies.size ? dependencies : undefined,
	};
}
