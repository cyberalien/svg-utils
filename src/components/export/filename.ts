import type { FactoryIconData } from '../types/data.js';
import type { ComponentFactoryFileSystemOptions } from '../types/options.js';

/**
 * Generate component filename based on options
 *
 * @param icon Icon data (name and prefix)
 * @param componentExtension Component file extension (e.g. '.tsx')
 * @param options Factory options
 * @returns Generated filename
 */
export function getGeneratedComponentFilename(
	icon: Pick<FactoryIconData, 'name' | 'prefix'>,
	componentExtension: string,
	options: Pick<
		ComponentFactoryFileSystemOptions,
		'doubleDirsForComponents' | 'prefixDirsForComponents'
	>
): string {
	const { name, prefix } = icon;
	const { prefixDirsForComponents } = options;
	const prefixDir = prefixDirsForComponents
		? `${
				typeof prefixDirsForComponents === 'string'
					? prefixDirsForComponents
					: prefix
		  }/`
		: '';

	return (
		// Prefix
		prefixDir +
		// First letter of name
		(options.doubleDirsForComponents
			? `${name.slice(0, 1).toLowerCase()}/`
			: '') +
		// Icon name
		name +
		// Extension
		componentExtension
	);
}
