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
import { addVueComponentTypes } from './helpers/ts/vue.js';
import { minifyViewBox } from '../svg/viewbox/minify.js';
import { getViewBoxRatio } from './helpers/content/ratio.js';
import { stringifyStylesheet } from '../css/stylesheet.js';
import { addFallbackFunctionAsset } from './helpers/functions/fallback.js';
import { addCustomFunctionAsset } from './helpers/functions/custom.js';

interface VueOptions extends ComponentFactoryOptions {
	// Use TypeScript
	ts?: boolean;
}

/**
 * Create Vue component code
 */
export function createVueComponent(
	data: FactoryIconData,
	options: VueOptions
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
		imports.named['@iconify/css-vue'] = new Set(['Icon']);
		dependencies.add('@iconify/css-vue');
	}

	// Add Vue imports
	const vueNamedImports = new Set<string>();
	imports.named['vue'] = vueNamedImports;

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
	const isStringViewBox = !fallback;
	const hasComputedRatio = hasComputedViewbox && isStringViewBox;

	if (!hasComputedViewbox && (options.width || options.height)) {
		// If viewBox is hardcoded and one of width/height is set, size is fixed
		hasFixedSize = true;
	}

	// Get props
	const componentCode: string[] = [];
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
						computedStates.push(`'${state}': props['${state}']`);
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
							`'${stateName}': namedStateValue(props['${stateName}'], '${defaultStateValue}')`
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
				computedStates.push(`'${state}': props['${state}']`);
			}

			// Add computed states
			if (computedStates.length) {
				componentCode.push(
					`const states = computed(() => ({ ${computedStates.join(', ')} }));`
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
					componentCode.push(
						`const fallback = computed(() => ${func}(${JSON.stringify(statefulData.fallback)},states.value));`
					);
				}

				// Compute class name
				componentCode.push(
					`const className = computed(() => Object.entries(states.value).map(([key, value]) => value ? \`state-\${value === true ? key : value}\` : '').join(' ').trim() || undefined);`
				);
				props.className = {
					value: 'className',
					template: ':class="className"',
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
		componentCode.push(
			`const baseViewBox = ${getViewBox(viewBox)};`,
			`const squareViewBox = ${getViewBox(makeSquareViewBox(viewBox))};`,
			`const viewBox = computed(() => props.square ? squareViewBox : baseViewBox);`
		);
	} else {
		// Hardcoded viewBox
		componentCode.push(`const viewBox = ${getViewBox(viewBox)};`);
	}

	// Compute width/height ratio
	const ratioValue = getViewBoxRatio(viewBox);
	if (hasComputedRatio) {
		componentCode.push(
			`const ratio = computed(() => props.square ? 1 : ${ratioValue});`
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
				template: ':width="width"',
			};
			props.height = {
				type: 'string',
				value: 'height',
				template: ':height="height"',
			};
		} else {
			// Add computed size and getSizeProps() function
			const getSizeProps = addSizeFunctionAsset(imports, assets, options);
			componentCode.push(
				`const size = computed(() => ${getSizeProps}(props.width, props.height, ${
					hasComputedRatio ? 'ratio.value' : ratioValue
				}));`
			);

			// Add width and height props
			props.width = {
				type: 'string',
				value: 'width',
				// Spread computed size.value
				template: 'v-bind="size"',
			};
			props.height = {
				type: 'string',
				value: 'height',
				// Included in computed size.value
				template: '',
			};
		}
	}

	// Add computed import if needed
	if (componentCode.some((line) => line.includes('computed('))) {
		vueNamedImports.add('computed');
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
		template: ':viewBox="viewBox"',
	};

	// Add content
	componentCode.push(`const content = ${stringifyFactoryIconContent(icon)};`);
	props.content = {
		value: 'content',
		template: fallback
			? `:content="content" ${computedFallback ? ':fallback="fallback"' : `fallback="${fallback}"`}`
			: 'v-html="content"',
	};

	// Add props
	const usedProps = getUsedFactoryProps(props);
	if (usedProps.length) {
		const tsCode = useTS
			? `<{\n${stringifyFactoryPropTypes(props)}\n}>`
			: '';
		componentCode.unshift(
			`const props = defineProps${tsCode}(${
				tsCode ? '' : JSON.stringify(usedProps)
			});\n`
		);
	}

	// Create template
	const tag = fallback ? 'Icon' : 'svg';
	const template = `<template><${tag} ${stringifyFactoryProps(
		props,
		':{prop}="{value}"'
	)} /></template>`;

	// Generate content
	const scriptContent = (
		stringifyFactoryImports(imports) +
		'\n' +
		componentCode.join('\n')
	).trim();

	let content = scriptContent
		? `<script setup${useTS ? ' lang="ts"' : ''}>
${scriptContent}
</script>
${template}
`
		: template;

	// Add styles
	const style = options.cssMode === 'prop' ? styleContent : undefined;

	if (styleContent && !style) {
		content += `<style>\n${stringifyStylesheet(styleContent)}\n</style>\n`;
	}

	// Add types file
	const types = addVueComponentTypes(data, options, assets, props);

	// Return data
	return {
		assets,
		content,
		style,
		types,
		dependencies: dependencies.size ? dependencies : undefined,
	};
}
