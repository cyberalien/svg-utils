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
	options: Pick<
		ComponentFactoryOptions,
		'cssMode' | 'cssPath' | 'doubleDirsForCSS'
	>
): GeneratedAssetPath {
	const { cssPath, doubleDirsForCSS, cssMode } = options;

	// Filename
	const baseName = doubleDirsForCSS
		? `${name.slice(0, 1).toLowerCase()}/${name}`
		: name;
	const filename =
		cssMode === 'module' ? `${baseName}.module.css` : `${baseName}.css`;

	// Return paths
	return getGeneratedAssetFilename(filename, cssPath);
}
