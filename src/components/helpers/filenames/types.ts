import type { FactoryIconData } from '../../types/data.js';
import type {
	ComponentFactoryFileSystemOptions,
	GeneratedAssetPath,
} from '../../types/options.js';
import { getGeneratedComponentFilename } from '../../export/filename.js';
import { getUniqueHash } from '../../../helpers/hash/unique.js';
import { getGeneratedAssetFilename } from './asset.js';

/**
 * Generate component types filename based on options
 */
export function getGeneratedComponentTypesFilename(
	icon: Pick<FactoryIconData, 'name' | 'prefix'>,
	content: string,
	options: Pick<
		ComponentFactoryFileSystemOptions,
		| 'rootPath'
		| 'doubleDirsForComponents'
		| 'prefixDirsForComponents'
		| 'sharedTypes'
	>
): GeneratedAssetPath {
	if (options.sharedTypes) {
		const hash = getUniqueHash(content, {
			css: true,
			length: 8,
		});
		return getGeneratedAssetFilename(
			`types/${hash}.d.ts`,
			options.rootPath
		);
	}

	const filename = getGeneratedComponentFilename(icon, '.d.ts', options);
	return {
		filename,
		import: `./${filename.split('/').pop()!}`,
	};
}
