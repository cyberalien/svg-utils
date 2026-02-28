import { getComponentSizeValues } from './helpers/content/size.js';
import { stringifyFactoryIconContent } from './helpers/content/stringify.js';
import { getGeneratedComponentTypesFilename } from './helpers/filenames/types.js';
import type { FactoryIconData } from './types/data.js';
import type { ComponentFactoryOptions } from './types/options.js';
import { stringifyIconViewBox } from '../svg/viewbox/value.js';
import { createFactoryImports } from './helpers/imports/create.js';
import { generateCSSFilesForComponent } from './helpers/css/generate.js';
import { stringifyFactoryImports } from './helpers/imports/stringify.js';
import type {
	FactoryGeneratedComponent,
	GeneratedAssetFile,
} from './types/component.js';
import {
	factoryPropTemplate,
	stringifyFactoryProps,
} from './helpers/props/stringify.js';
import { stringifyStylesheet } from '../css/stylesheet.js';

/**
 * Create raw component code
 */
export function createRawComponent(
	data: FactoryIconData,
	options: ComponentFactoryOptions
): FactoryGeneratedComponent {
	const icon = data.icon;
	const viewBox = icon.viewBox;

	// Init data
	const assets: GeneratedAssetFile[] = [];
	const imports = createFactoryImports();
	const codeLines: string[] = [];

	// Add CSS
	const style = generateCSSFilesForComponent(icon, imports, assets, options);
	const isEmbeddedCSS = options.cssMode === 'embed';

	// Get props
	const props: Record<string, string> = {
		xmlns: 'http://www.w3.org/2000/svg',
		...getComponentSizeValues(options, viewBox),
		viewBox: stringifyIconViewBox(viewBox),
	};

	// Wrap icon content in <svg> tag
	const iconContent = {
		...icon,
		content: `<svg ${stringifyFactoryProps(props, factoryPropTemplate)}>${
			isEmbeddedCSS && style
				? `<style>${stringifyStylesheet(style)}</style>`
				: ''
		}${icon.content}</svg>`,
	};

	// Convert to string, export icon
	codeLines.push(
		`const icon = ${stringifyFactoryIconContent(iconContent)};\n`
	);
	codeLines.push('export default icon;\n');

	// Add imports
	const importsCode = stringifyFactoryImports(imports);
	if (importsCode) {
		codeLines.unshift(importsCode);
	}

	// Add types
	const typesContent = `const icon: string;\nexport default icon;\n`;
	assets.push({
		...getGeneratedComponentTypesFilename(data, typesContent, options),
		content: typesContent,
	});

	// Return data
	return {
		assets,
		content: codeLines.join('\n'),
		style: isEmbeddedCSS ? undefined : style,
	};
}
