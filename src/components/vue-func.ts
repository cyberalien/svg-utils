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
import { addVueComponentTypes } from './helpers/ts/vue.js';
import type { FactoryComponentProps } from './helpers/props/types.js';
import { addSizeFunctionAsset } from './helpers/functions/size.js';
import { stringifyFactoryPropsAsJSON } from './helpers/props/object.js';
import { stringifyFactoryImports } from './helpers/imports/stringify.js';
import { makeSquareViewBox } from '../svg/viewbox/square.js';
import type { IconViewBox } from '../svg/viewbox/types.js';
import { getUsedFactoryProps } from './helpers/props/ts.js';
import { minifyViewBox } from '../svg/viewbox/minify.js';
import { getViewBoxRatio } from './helpers/content/ratio.js';
import { addCustomFunctionAsset } from './helpers/functions/custom.js';
import { addFallbackFunctionAsset } from './helpers/functions/fallback.js';

/**
 * Create functional Vue component code
 */
export function createVueFunctionalComponent(
	data: FactoryIconData,
	options: ComponentFactoryOptions
): FactoryGeneratedComponent {
	const icon = data.icon;
	const viewBox = icon.viewBox;
	const fallback = icon.defaultFallback;
	const statefulData = icon.statefulData;

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
	const vueNamedImports = new Set(['defineComponent', 'h']);
	imports.named['vue'] = vueNamedImports;

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
	const componentCode: string[] = [];
	const props: FactoryComponentProps = {};
	if (!fallback) {
		props.xmlns = 'http://www.w3.org/2000/svg';
	}

	// Set stateful props
	let computedFallback = false;
	if (statefulData) {
		const { supportedStates, allStates } = statefulData;
		if (supportedStates.size) {
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
				props['class'] = {
					value: 'class',
					template: `'class': className.value,`,
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
				template: 'width: props.width,',
			};
			props.height = {
				type: 'string',
				value: 'height',
				template: 'height: props.height,',
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
				template: '...size.value,',
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
		template: hasComputedViewbox ? 'viewBox: viewBox.value,' : 'viewBox,',
	};

	// Add content
	props[fallback ? 'content' : 'innerHTML'] = {
		value: stringifyFactoryIconContent(
			icon,
			isEmbeddedCSS ? style : undefined
		),
	};
	if (fallback) {
		props.fallback = computedFallback
			? {
					value: 'fallback',
					template: 'fallback: fallback.value,',
				}
			: fallback;
	}

	// Add types file
	const types = addVueComponentTypes(data, options, assets, props);

	// Add return value to component code
	componentCode.push(
		`return () => h(${fallback ? 'Icon' : "'svg'"}, { 
			${stringifyFactoryPropsAsJSON(props, '\n\t\t\t')}
		});`
	);

	// Generate component function
	const usedProps = getUsedFactoryProps(props);
	const componentFunction = `const Component = defineComponent(
	(${usedProps.length ? 'props' : ''}) => {
		${componentCode.join('\n\t\t')}
	},
	{
		props: ${JSON.stringify(usedProps)}
	}
);
`;

	// Generate content
	const content = `${stringifyFactoryImports(
		imports
	)}\n${componentFunction}\nexport default Component;\n`;

	// Return data
	return {
		assets,
		content,
		style: isEmbeddedCSS ? undefined : style,
		types,
		dependencies: dependencies.size ? dependencies : undefined,
	};
}
