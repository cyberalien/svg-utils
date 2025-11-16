import type { GeneratedAssetPath } from '../../types/options.js';

export const defaultHelpersDirectory = 'helpers';

/**
 * Generate asset filename based on options
 *
 * @param filename - Filename without path
 * @param rootPath - Root path
 * @returns Asset path
 */
export function getGeneratedAssetFilename(
	filename: string,
	rootPath: GeneratedAssetPath
): GeneratedAssetPath {
	const basePath = rootPath.filename;

	return {
		import: `${rootPath.import}/${filename}`,
		filename: `${basePath ? basePath + '/' : ''}${filename}`,
	};
}
