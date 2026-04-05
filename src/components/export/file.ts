import type {
	FactoryComponent,
	FactoryGeneratedComponent,
} from '../types/component.js';
import type { FactoryIconData } from '../types/data.js';
import type { ComponentFactoryFileSystemOptions } from '../types/options.js';
import { getGeneratedComponentFilename } from './filename.js';

interface Options extends Pick<
	ComponentFactoryFileSystemOptions,
	'doubleDirsForComponents' | 'prefixDirsForComponents'
> {
	// Include prefix in export name, default = false
	includePrefix?: boolean | string;

	// Component extension
	extension: string;

	// CSS extension, default = '.css'
	cssExtension?: string;
}

/**
 * Add icon and filename to generated component
 */
export function convertGeneratedComponentToFile(
	icon: Pick<FactoryIconData, 'name' | 'prefix'>,
	item: FactoryGeneratedComponent,
	options: Options
): FactoryComponent {
	const { prefix, name } = icon;
	const filename = getGeneratedComponentFilename(
		icon,
		options.extension,
		options
	);

	return {
		icon: options.includePrefix
			? `${typeof options.includePrefix === 'string' ? options.includePrefix : prefix}/${name}`
			: name,
		filename,
		css: item.style
			? getGeneratedComponentFilename(
					icon,
					options.cssExtension ?? '.css',
					options
				)
			: undefined,
		...item,
	};
}
