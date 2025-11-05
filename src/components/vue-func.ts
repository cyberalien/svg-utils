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

/**
 * Create functional Vue component code
 */
export function createVueFunctionalComponent(
	data: FactoryIconData,
	options: ComponentFactoryOptions
): FactoryGeneratedComponent {
	// Init data
	const assets: GeneratedAssetFile[] = [];
	const imports = createFactoryImports();

	// Check if fallback is used
	const hasFallback = !!data.fallback;
	if (hasFallback) {
		imports.named['@iconify/css-vue'] = new Set(['Icon']);
	}

	// Add Vue imports
	const vueNamedImports = new Set(['defineComponent', 'h']);
	imports.named['vue'] = vueNamedImports;

	// Add CSS
	const style = generateCSSFilesForComponent(
		data.icon,
		imports,
		assets,
		options
	);
	const isEmbeddedCSS = options.cssMode === 'embed';

	// Check if size is fixed and if viewBox is computed
	let hasFixedSize = !!options.width && !!options.height;

	const viewBox = data.viewBox;
	const hasComputedViewbox =
		options.square && !hasFixedSize && viewBox.width !== viewBox.height;
	const isStringViewBox = !hasFallback;
	const hasComputedRatio = hasComputedViewbox && isStringViewBox;

	if (!hasComputedViewbox && (options.width || options.height)) {
		// If viewBox is hardcoded and one of width/height is set, size is fixed
		hasFixedSize = true;
	}

	// Get props
	const componentCode: string[] = [];
	const props: FactoryComponentProps = {};
	if (!hasFallback) {
		props.xmlns = 'http://www.w3.org/2000/svg';
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
		const sizeProps = getComponentSizeValues(options, data.viewBox);
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
			vueNamedImports.add('computed');

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
	props[hasFallback ? 'content' : 'innerHTML'] = {
		value: stringifyFactoryIconContent(
			data.icon,
			options,
			isEmbeddedCSS ? style : undefined
		),
	};
	if (data.fallback) {
		props.fallback = data.fallback;
	}

	// Add types file
	const types = addVueComponentTypes(data, options, assets, props);

	// Add return value to component code
	componentCode.push(
		`return () => h(${hasFallback ? 'Icon' : "'svg'"}, { 
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
	};
}
