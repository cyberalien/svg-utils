import type { IconStatesList } from './types.js';

// Various keywords to avoid for state names to prevent conflicts with generated code and reserved keywords in JavaScript
const reservedStateNames = new Set<string>([
	// Reserved keywords
	'constructor',
	'class',
	'in',
	'of',
	'if',
	'for',
	'while',
	'switch',
	'case',
	'break',
	'continue',
	'default',
	'do',
	'else',
	'finally',
	'return',
	'throw',
	'try',
	'catch',
	'with',
	'yield',
	'async',
	'await',
	'static',
	'using',
	'function',
	'var',
	'let',
	'const',
	'this',
	'import',
	'export',
	// Variables used in components for other properties and computed values
	'props',
	'classname',
	'viewbox',
	'fallback',
	'states',
	'width',
	'height',
	'size',
	'square',
]);

/**
 * Validates states list to avoid issues when generating icons
 */
export function assertValidStatesList(list: IconStatesList) {
	for (const state of list) {
		const stateName = typeof state === 'string' ? state : state[0];

		// Lower case only
		if (!stateName.match(/^[a-z$]+$/)) {
			throw new Error(`Invalid state name "${stateName}".`);
		}

		if (reservedStateNames.has(stateName)) {
			throw new Error(
				`State name "${stateName}" is reserved to avoid conflicts and cannot be used.`
			);
		}
	}
}
