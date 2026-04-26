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
import { stringifyFactoryImports } from './helpers/imports/stringify.js';
import { makeSquareViewBox } from '../svg/viewbox/square.js';
import type { IconViewBox } from '../svg/viewbox/types.js';
import { stringifyFactoryProps } from './helpers/props/stringify.js';
import {
	getUsedFactoryProps,
	stringifyFactoryPropTypes,
} from './helpers/props/ts.js';
import { getViewBoxRatio } from './helpers/content/ratio.js';
import { stringifyStylesheet } from '../css/stylesheet.js';
import { addCustomFunctionAsset } from './helpers/functions/custom.js';
import { addAstroComponentTypes } from './helpers/ts/astro.js';
import { addReplaceIDsFunctionAsset } from './helpers/functions/ids.js';
import { cleanupJSXRenamedProps } from './helpers/props/cleanup.js';
import { checkForUniqueIDs } from './helpers/code/ids.js';

/**
 * Create Astro component code
 */
export function createAstroComponent(
	data: FactoryIconData,
	options: ComponentFactoryOptions
): FactoryGeneratedComponent {
	const icon = data.icon;
	const viewBox = icon.viewBox;
	const statefulData = icon.statefulData;

	// Init data
	const assets: GeneratedAssetFile[] = [];
	const imports = createFactoryImports();

	// Add CSS
	const styleContent = generateCSSFilesForComponent(
		icon,
		imports,
		assets,
		options
	);

	// Check if size is fixed and if viewBox is computed
	let hasFixedSize = !!options.width && !!options.height;

	const hasComputedViewbox =
		options.square && !hasFixedSize && viewBox.width !== viewBox.height;

	if (!hasComputedViewbox && (options.width || options.height)) {
		// If viewBox is hardcoded and one of width/height is set, size is fixed
		hasFixedSize = true;
	}

	// Get props
	const componentCode: string[] = [];
	const props: FactoryComponentProps = {
		xmlns: 'http://www.w3.org/2000/svg',
	};

	// Set stateful props
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
						computedStates.push(`'${state}': ${state}Prop`);
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
			}

			// Add computed states
			if (computedStates.length) {
				componentCode.push(
					`const states = { ${computedStates.join(', ')} };`
				);

				// Compute class name
				componentCode.push(
					`const className = Object.entries(states).map(([key, value]) => value ? \`state-\${value === true ? key : value}\` : '').join(' ').trim();`
				);
				props.class = {
					value: 'className',
					template: 'class={className}',
				};
			}
		}
	}

	// Compute viewBox
	const viewBoxPropValue = `viewBox${hasComputedViewbox ? 'Computed' : ''}`;
	const getViewBox = (viewBox: IconViewBox) =>
		`'${stringifyIconViewBox(viewBox)}'`;
	if (hasComputedViewbox) {
		// Computed viewBox, based on square prop
		componentCode.push(
			`const baseViewBox = ${getViewBox(viewBox)};`,
			`const squareViewBox = ${getViewBox(makeSquareViewBox(viewBox))};`,
			`const ${viewBoxPropValue} = squareProp ? squareViewBox : baseViewBox;`
		);
	} else {
		// Hardcoded viewBox
		componentCode.push(
			`const ${viewBoxPropValue} = ${getViewBox(viewBox)};`
		);
	}

	// Compute width/height ratio
	const ratioValue = getViewBoxRatio(viewBox);
	if (hasComputedViewbox) {
		componentCode.push(`const ratio = squareProp ? 1 : ${ratioValue};`);
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
		// Add computed size and getSizeProps() function
		const getSizeProps = addSizeFunctionAsset(imports, assets, options);
		componentCode.push(
			`const size = ${getSizeProps}(widthProp, heightProp, ${
				hasComputedViewbox ? 'ratio' : ratioValue
			});`
		);

		// Add width and height props
		props.width = {
			type: 'string',
			value: 'width',
			// Spread computed size
			template: '{...size}',
		};
		props.height = {
			type: 'string',
			value: 'height',
			// Included in computed size
			template: '',
		};
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
		template: `viewBox={${viewBoxPropValue}}`,
	};

	// Add content
	let stringifiedContent = stringifyFactoryIconContent(icon);
	if (checkForUniqueIDs(icon.content)) {
		// Do not embed replaceIDs function if there are no IDs to replace, to avoid unnecessary dependencies and code
		const replaceIDs = addReplaceIDsFunctionAsset(imports, assets, options);
		stringifiedContent = `${replaceIDs}(${stringifiedContent})`;
	}
	componentCode.push(`const content = ${stringifiedContent};`);

	// Add props
	const usedProps = getUsedFactoryProps(props);

	const propsDestricturing = usedProps.length
		? `{${[...usedProps.map((prop) => `${prop}: ${prop}Prop`), '...props'].join(', ')}}`
		: 'props';
	componentCode.unshift(`const ${propsDestricturing} = Astro.props;\n`);

	// Add types before props
	const propTypes = stringifyFactoryPropTypes(props);
	if (propTypes.trim()) {
		componentCode.unshift(
			`/** @type {{${propTypes.replace(/\s*\n\s*/g, ' ').trim()}}} */`
		);
	}

	// Create template
	const template = `<svg ${stringifyFactoryProps(
		props,
		'{prop}={{value}}'
	)} {...props} set:html={content}></svg>`;

	// Generate content
	const scriptContent = (
		stringifyFactoryImports(imports) +
		'\n' +
		componentCode.join('\n')
	).trim();

	let content = `---
${scriptContent}
---

${template}
`;

	// Add styles
	const style = options.cssMode === 'prop' ? styleContent : undefined;
	if (styleContent && !style) {
		content += `<style>\n${stringifyStylesheet(styleContent)}\n</style>\n`;
	}

	// Add types file
	const types = addAstroComponentTypes(data, options, assets, props);

	// Return data
	return {
		assets,
		content: cleanupJSXRenamedProps(content),
		style,
		types,
	};
}
