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
import { stringifyFactoryProps } from './helpers/props/stringify.js';
import { stringifyFactoryImports } from './helpers/imports/stringify.js';
import { makeSquareViewBox } from '../svg/viewbox/square.js';
import type { IconViewBox } from '../svg/viewbox/types.js';
import {
	getUsedFactoryProps,
	stringifyFactoryPropTypes,
} from './helpers/props/ts.js';
import { minifyViewBox } from '../svg/viewbox/minify.js';
import { getViewBoxRatio } from './helpers/content/ratio.js';
import { addSolidComponentTypes } from './helpers/ts/solid.js';
import { addCustomFunctionAsset } from './helpers/functions/custom.js';
import { addFallbackFunctionAsset } from './helpers/functions/fallback.js';
import { addReplaceIDsFunctionAsset } from './helpers/functions/ids.js';
import { cleanupJSXRenamedProps } from './helpers/props/cleanup.js';

interface Options extends ComponentFactoryOptions {
	// Use TypeScript
	ts?: boolean;
}

/**
 * Create Solid component code
 */
export function createSolidComponent(
	data: FactoryIconData,
	options: Options
): FactoryGeneratedComponent {
	const icon = data.icon;
	const viewBox = icon.viewBox;
	const fallback = icon.defaultFallback;
	const statefulData = icon.statefulData;

	// Check options
	const useTS = options.ts ?? false;

	// Init data
	const assets: GeneratedAssetFile[] = [];
	const imports = createFactoryImports();
	const dependencies = new Set<string>();

	// Check if fallback is used
	if (fallback) {
		imports.named['@iconify/css-solid'] = new Set(['Icon']);
		dependencies.add('@iconify/css-solid');
	}

	// Add Solid imports
	const solidNamedImports = new Set<string>([]);
	imports.named['solid-js'] = solidNamedImports;

	// Add CSS
	const style = generateCSSFilesForComponent(icon, imports, assets, options);
	const isEmbeddedCSS = options.cssMode === 'embed';

	// Check if size is fixed and if viewBox is computed
	let hasFixedSize = !!options.width && !!options.height;

	const hasComputedViewbox =
		options.square && !hasFixedSize && viewBox.width !== viewBox.height;
	const isStringViewBox = !fallback;
	const hasComputedRatio = hasComputedViewbox && isStringViewBox;

	if (!hasComputedViewbox && (options.width || options.height)) {
		// If viewBox is hardcoded and one of width/height is set, size is fixed
		hasFixedSize = true;
	}

	// Get props
	const componentExternalCode: string[] = [];
	const componentInternalCode: string[] = [];
	const props: FactoryComponentProps = {};
	if (!fallback) {
		props.xmlns = 'http://www.w3.org/2000/svg';
	}

	// Set stateful props
	let computedFallback = false;
	if (statefulData) {
		const { supportedStates, allStates, staticClassname } = statefulData;
		if (supportedStates.size || staticClassname) {
			const computedStates: string[] = [];
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
						computedStates.push(`'${state}': local['${state}']`);
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
							`'${stateName}': namedStateValue(local['${stateName}'], '${defaultStateValue}')`
						);
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
				computedStates.push(`'${state}': local['${state}']`);
			}

			// Add computed states
			if (computedStates.length) {
				componentInternalCode.push(
					`const states = createMemo(() => ({ ${computedStates.join(', ')} }));`
				);

				// Compute stateful fallback
				if (fallback && statefulData.fallback) {
					computedFallback = true;
					const func = addFallbackFunctionAsset(
						imports,
						assets,
						options,
						statefulData.defaultStateValues
					);
					componentInternalCode.push(
						`const fallback = createMemo(() => ${func}(${JSON.stringify(statefulData.fallback)},states()));`
					);
				}

				// Compute class name
				componentInternalCode.push(
					`const className = createMemo(() => Object.entries(states()).map(([key, value]) => value ? \`state-\${value === true ? key : value}\` : '').join(' ').trim() || undefined);`
				);
				props.class = {
					value: 'className',
					template: 'class={className()}',
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
			`const viewBox = createMemo(() => local.square ? squareViewBox : baseViewBox);`
		);
	} else {
		// Hardcoded viewBox
		componentExternalCode.push(`const viewBox = ${getViewBox(viewBox)};`);
	}

	// Compute width/height ratio
	const ratioValue = getViewBoxRatio(viewBox);
	if (hasComputedRatio) {
		componentInternalCode.push(
			`const ratio = createMemo(() => local.square ? 1 : ${ratioValue});`
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
		if (fallback) {
			// Computed size in fallback component
			props.width = {
				type: 'string',
				value: 'width',
				template: 'width={local.width}',
			};
			props.height = {
				type: 'string',
				value: 'height',
				template: 'height={local.height}',
			};
		} else {
			// Add computed size and getSizeProps() function
			const getSizeProps = addSizeFunctionAsset(imports, assets, options);
			componentInternalCode.push(
				`const size = createMemo(() => ${getSizeProps}(local.width, local.height, ${
					hasComputedRatio ? 'ratio()' : ratioValue
				}));`
			);

			// Add width and height props
			props.width = {
				type: 'string',
				value: 'width',
				// Spread computed size
				template: '{...size()}',
			};
			props.height = {
				type: 'string',
				value: 'height',
				// Included in computed size
				template: '',
			};
		}
	}

	// Generate innerHTML before useMemo is added
	const stringifiedContent = stringifyFactoryIconContent(
		icon,
		isEmbeddedCSS ? style : undefined
	);
	if (!fallback) {
		// Replace IDs to avoid conflicts when multiple instances are used
		const replaceIDs = addReplaceIDsFunctionAsset(imports, assets, options);
		componentInternalCode.push(
			`const content = createMemo(() => ${replaceIDs}(${stringifiedContent}));`
		);
	} else {
		componentExternalCode.push(`const content = ${stringifiedContent};`);
	}

	// Add createMemo import if needed
	if (componentInternalCode.some((line) => line.includes('createMemo'))) {
		solidNamedImports.add('createMemo');
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
		template: `viewBox={viewBox${hasComputedViewbox ? '()' : ''}}`,
	};

	// Add content
	props.content = {
		value: 'content',
		template: fallback
			? `content={content} fallback={${computedFallback ? 'fallback()' : `"${fallback}"`}}`
			: 'innerHTML={content()}',
	};

	// Split props
	const usedProps = getUsedFactoryProps(props);
	if (usedProps.length) {
		componentInternalCode.unshift(
			`const [local, others] = splitProps(props, ${JSON.stringify(usedProps)});\n`
		);
		solidNamedImports.add('splitProps');
	}

	// Add return value to component code
	const tag = fallback ? 'Icon' : 'svg';
	const template = `<${tag} ${stringifyFactoryProps(
		props,
		'{prop}={{value}}'
	)} {...${usedProps.length ? 'others' : 'props'}} />`;
	componentInternalCode.push(`return (${template});`);

	// Generate code before function
	const beforeFunction = componentExternalCode.length
		? componentExternalCode.join('\n') + '\n\n'
		: '';

	// Types
	const propTypes = stringifyFactoryPropTypes(props);
	const typesCode = useTS
		? `interface Props {\n${propTypes}\n};\n\n`
		: propTypes
			? `/** @param props {{${propTypes.replace(/\s*\n\s*/g, ' ').trim()}}} */\n`
			: '';

	// Generate component function
	const componentFunction = `${typesCode}function Component(props${useTS ? `: Props` : ''}) {
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
	const types = addSolidComponentTypes(data, options, assets, props);

	// Return data
	return {
		assets,
		content,
		style: isEmbeddedCSS ? undefined : style,
		types,
		dependencies: dependencies.size ? dependencies : undefined,
	};
}
