import type { FactoryComponent } from '../types/component.js';

type Types = string | Record<string, string>;

interface Options {
	// Extension to add to filenames, includes dot, e.g. '.svelte'
	ext?: string;

	// Old data to merge with
	data?: Record<string, Types>;

	// Default property
	defaultProp?: string;
}

/**
 * Add exports for main files to object
 */
export function createExportsForMainFiles(
	data: FactoryComponent[],
	options: Options = {}
): Record<string, Types> {
	const result =
		options?.data || (Object.create(null) as Record<string, Types>);
	const ext = options.ext || '';
	const defaultProp = options.defaultProp || 'default';

	for (const { icon, filename, types } of data) {
		result[`./${icon}${ext}`] = types
			? {
					types: `./${types}`,
					[defaultProp]: `./${filename}`,
			  }
			: `./${filename}`;
	}
	return result;
}
