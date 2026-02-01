import { getUniqueHash } from '../helpers/hash/unique.js';
import { sortObject } from '../helpers/misc/sort-object.js';
import type { CSSHashOptions, CSSRules } from './types.js';

/**
 * Get class name for CSS rules
 */
export function createCSSClassName(
	rules: CSSRules,
	options: CSSHashOptions
): string {
	// Sort properties to ensure consistent class names
	const sorted = sortObject(rules);

	// Hash it
	return getUniqueHash(sorted, {
		css: true,
		length: 6,
		...options,
	});
}
