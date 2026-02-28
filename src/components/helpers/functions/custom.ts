import { camelToKebab } from '../../../helpers/misc/strings.js';
import type { GeneratedAssetFile } from '../../types/component.js';
import type { ComponentFactoryOptions } from '../../types/options.js';
import {
	defaultHelpersDirectory,
	getGeneratedAssetFilename,
} from '../filenames/asset.js';
import type { FactoryComponentImports } from '../imports/types.js';

interface Data {
	functionName: string;
	content: string;
	exportNames?: Set<string>;
	jsName?: string;
}

/**
 * Adds a custom function to assets
 */
export function addCustomFunctionAsset(
	imports: FactoryComponentImports,
	assets: GeneratedAssetFile[],
	options: Pick<ComponentFactoryOptions, 'rootPath' | 'helpersDirectory'>,
	data: Data
) {
	const { functionName, content, exportNames } = data;
	const assetDirectory = options.helpersDirectory ?? defaultHelpersDirectory;
	const filename = getGeneratedAssetFilename(
		`${assetDirectory}/${data.jsName ?? camelToKebab(functionName)}.js`,
		options.rootPath
	);
	assets.push({
		...filename,
		content,
	});
	imports.named[filename.import] = exportNames ?? new Set([functionName]);
}
