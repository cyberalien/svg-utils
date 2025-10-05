import type {
	ComponentFactoryFileSystemOptions,
	GeneratedAssetPath,
} from '../../types/options.js';

/**
 * Get relative path to root directory from component
 *
 * @param options Factory options
 * @returns Asset path
 */
export function getFactoryRelativeRootPath(
	options: Pick<
		ComponentFactoryFileSystemOptions,
		'doubleDirsForComponents' | 'prefixDirsForComponents'
	>
): GeneratedAssetPath {
	const { prefixDirsForComponents } = options;
	const prefixDir = prefixDirsForComponents
		? typeof prefixDirsForComponents === 'string'
			? prefixDirsForComponents
			: 'prefix'
		: '';
	const parentCount =
		(prefixDir ? prefixDir.split('/').length : 0) +
		(options.doubleDirsForComponents ? 1 : 0);

	return {
		import: parentCount ? '../'.repeat(parentCount - 1) + '..' : '.',
		filename: '',
	};
}
