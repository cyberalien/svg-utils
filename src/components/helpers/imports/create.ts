import type { FactoryComponentImports } from './types.js';

/**
 * Create imports object
 */
export function createFactoryImports(): FactoryComponentImports {
	return {
		default: Object.create(null),
		named: Object.create(null),
		types: Object.create(null),
		full: new Set(),
		css: new Set(),
		modules: Object.create(null),
	};
}
