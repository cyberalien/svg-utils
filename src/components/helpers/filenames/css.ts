import type {
	ComponentFactoryOptions,
	GeneratedAssetPath,
} from '../../types/options.js';
import { getGeneratedAssetFilename } from './asset.js';

/**
 * Generate CSS filename based on options
 */
export function getGeneratedCSSFilename(
	name: string,
	options: Pick<ComponentFactoryOptions, 'cssPath' | 'doubleDirsForCSS'>
): GeneratedAssetPath {
	const { cssPath, doubleDirsForCSS } = options;

	// Filename
	const baseName = doubleDirsForCSS
		? `${name.slice(0, 1).toLowerCase()}/${name}`
		: name;
	const filename = `${baseName}.css`;

	// Return paths
	return getGeneratedAssetFilename(filename, cssPath);
}
