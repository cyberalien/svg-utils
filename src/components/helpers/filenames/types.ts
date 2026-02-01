import type { FactoryIconData } from '../../types/data.js';
import type {
	ComponentFactoryFileSystemOptions,
	GeneratedAssetPath,
} from '../../types/options.js';
import { getGeneratedComponentFilename } from '../../export/filename.js';
import { getUniqueHash } from '../../../helpers/hash/unique.js';
import { getGeneratedAssetFilename } from './asset.js';
import type { UniqueHashPartialOptions } from '../../../helpers/hash/types.js';

interface Options
	extends
		Pick<UniqueHashPartialOptions, 'context'>,
		Pick<
			ComponentFactoryFileSystemOptions,
			| 'rootPath'
			| 'doubleDirsForComponents'
			| 'prefixDirsForComponents'
			| 'sharedTypes'
		> {
	//
}

/**
 * Generate component types filename based on options
 */
export function getGeneratedComponentTypesFilename(
	icon: Pick<FactoryIconData, 'name' | 'prefix'>,
	content: string,
	options: Options
): GeneratedAssetPath {
	if (options.sharedTypes) {
		const hash = getUniqueHash(content, {
			context: options.context, // Pick only context
			css: true,
			length: 8,
		});
		return getGeneratedAssetFilename(
			`types/${hash}.d.ts`,
			options.rootPath
		);
	}

	const filename = getGeneratedComponentFilename(icon, '.d.ts', options);
	const rootPath = options.rootPath.filename;
	return {
		filename: `${rootPath ? rootPath + '/' : ''}${filename}`,
		import: `./${filename.split('/').pop()!}`,
	};
}
