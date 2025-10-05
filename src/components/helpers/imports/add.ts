import type { FactoryComponentImports } from './types.js';

function addToSet(set: Set<string>, names: string | string[]): void {
	if (Array.isArray(names)) {
		for (const name of names) {
			set.add(name);
		}
	} else {
		set.add(names);
	}
}

/**
 * Add named import
 */
export function addNamedImport(
	data: FactoryComponentImports,
	source: string,
	names: string | string[]
): void {
	addToSet((data.named[source] ??= new Set()), names);
}

/**
 * Add type import
 */
export function addTypeImport(
	data: FactoryComponentImports,
	source: string,
	types: string | string[]
): void {
	addToSet((data.types[source] ??= new Set()), types);
}
