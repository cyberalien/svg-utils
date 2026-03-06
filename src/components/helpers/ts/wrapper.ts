import { getGeneratedComponentTypesFilename } from '../filenames/types.js';
import { stringifyFactoryPropTypes } from '../props/ts.js';
import type { FactoryIconData } from '../../types/data.js';
import type { ComponentFactoryOptions } from '../../types/options.js';
import type { FactoryComponentProps } from '../props/types.js';
import type { GeneratedAssetFile } from '../../types/component.js';

/**
 * Properties to omit
 */
export const omitComponentSVGProps = `'viewBox' | 'width' | 'height' | 'xmlns'`;

/**
 * Add component types
 */
export function addComponentTypes(
	template: string,
	data: FactoryIconData,
	options: ComponentFactoryOptions,
	assets: GeneratedAssetFile[],
	props: FactoryComponentProps
): string {
	// Generate prop types
	const propTypes = stringifyFactoryPropTypes(props);

	// Generate content
	const content = template.replace('/* PROPS */', propTypes);

	const filename = getGeneratedComponentTypesFilename(data, content, options);
	assets.push({
		...filename,
		content,
	});

	return filename.filename;
}
