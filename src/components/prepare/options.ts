import type { ComponentFactoryFileSystemOptions } from '../types/options.js';
import { getFactoryRelativeRootPath } from '../helpers/filenames/path.js';
import { getGeneratedAssetFilename } from '../helpers/filenames/asset.js';

/**
 * Generate file system options
 */
export function componentFactoryFileSystemOptions(
	base: Partial<ComponentFactoryFileSystemOptions>,
	pathPrefix?: string
): ComponentFactoryFileSystemOptions {
	const doubleDirsForCSS = base.doubleDirsForCSS ?? true;
	const prefixDirsForComponents = base.prefixDirsForComponents ?? false;
	const doubleDirsForComponents = base.doubleDirsForComponents ?? true;

	const rootPath =
		base.rootPath ??
		getFactoryRelativeRootPath(
			{
				doubleDirsForComponents,
				prefixDirsForComponents,
			},
			pathPrefix
		);

	const cssPath = base.cssPath ?? getGeneratedAssetFilename('css', rootPath);

	return {
		doubleDirsForCSS,
		prefixDirsForComponents,
		doubleDirsForComponents,
		rootPath,
		cssPath,
		sharedTypes: base.sharedTypes ?? false,
	};
}
