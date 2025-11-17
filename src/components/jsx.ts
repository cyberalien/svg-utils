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
import { addReactComponentTypes } from './helpers/ts/react.js';

interface Options extends ComponentFactoryOptions {
	// JSX mode
	jsx: 'react';

	// Supported fallback package
	fallbackPackage?: string;

	// Use TypeScript
	ts?: boolean;
}

/**
 * Create functional Vue component code
 */
export function createJSXComponent(
	data: FactoryIconData,
	options: Options
): FactoryGeneratedComponent {
	// Check options
	const useTS = options.ts ?? false;

	// Init data
	const assets: GeneratedAssetFile[] = [];
	const imports = createFactoryImports();
	const dependencies = new Set<string>();

	// Modes
	const importPackage = 'react';
	const createElement = 'createElement';

	// Check if fallback is used
	const fallbackPackage = options.fallbackPackage || null;
	const hasFallback = !!(fallbackPackage && data.fallback);
	if (hasFallback) {
		imports.named[fallbackPackage] = new Set(['Icon']);
		dependencies.add(fallbackPackage);
	}

	// Add React imports
	const reactNamedImports = new Set([createElement]);
	imports.named[importPackage] = reactNamedImports;

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
			`const viewBox = useMemo(() => square ? squareViewBox : baseViewBox, [square]);`
		);
	} else {
		// Hardcoded viewBox
		componentExternalCode.push(`const viewBox = ${getViewBox(viewBox)};`);
	}

	// Compute width/height ratio
	const ratioValue = getViewBoxRatio(viewBox);
	if (hasComputedRatio) {
		componentInternalCode.push(
			`const ratio = useMemo(() => square ? 1 : ${ratioValue}, [square]);`
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
				template: 'width,',
			};
			props.height = {
				type: 'string',
				value: 'height',
				template: 'height,',
			};
		} else {
			// Add computed size and getSizeProps() function
			const getSizeProps = addSizeFunctionAsset(imports, assets, options);
			componentInternalCode.push(
				`const size = useMemo(() => ${getSizeProps}(width, height, ${
					hasComputedRatio ? 'ratio' : ratioValue
				}), [width, height${hasComputedRatio ? ', ratio' : ''}]);`
			);
			reactNamedImports.add('useMemo');

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
		value: stringifyFactoryIconContent(
			data.icon,
			options,
			isEmbeddedCSS ? style : undefined
		),
		template: hasFallback
			? undefined
			: 'dangerouslySetInnerHTML: {__html: {value}},',
	};
	if (hasFallback && data.fallback) {
		props.fallback = data.fallback;
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

	// Generate component function
	const usedProps = getUsedFactoryProps(props);
	const propsDestricturing = usedProps.length
		? `{${[...usedProps, '...props'].join(', ')}}`
		: 'props';
	const tsCode = useTS ? `<{\n${stringifyFactoryPropTypes(props)}\n}>` : '';
	const componentFunction = `function Component${tsCode}(${propsDestricturing}) {
\t${componentInternalCode.join('\n\t')}
}
`;

	// Generate content
	const content = `${stringifyFactoryImports(
		imports
	)}\n${beforeFunction}${componentFunction}\nexport default Component;\n`;

	// Add types file
	const types = addReactComponentTypes(data, options, assets, props);

	// Return data
	return {
		assets,
		content,
		style: isEmbeddedCSS ? undefined : style,
		types,
		dependencies: dependencies.size ? dependencies : undefined,
	};
}
