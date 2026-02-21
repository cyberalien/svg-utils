import type { StateSelectorSubParts } from '../types.js';

const uniqueKeys = ['tag', 'id'] as const;
const mergeKeys = ['name', 'attr', 'pseudo'] as const;

/**
 * Merge multiple selector parts into one
 */
export function mergeMultipleSelectorSubParts(
	parts: StateSelectorSubParts[]
): StateSelectorSubParts | null {
	const result: StateSelectorSubParts = {};
	for (const part of parts) {
		if (part.combinator) {
			if (!result.combinator) {
				result.combinator = part.combinator;
			} else if (result.combinator !== part.combinator) {
				// Cannot merge different combinators
				return null;
			}
		}

		for (const key of uniqueKeys) {
			const value = part[key];
			if (value) {
				if (result[key] && result[key] !== value) {
					// Cannot merge different values for unique key
					return null;
				}
				result[key] = value;
			}
		}

		for (const key of mergeKeys) {
			const values = part[key];
			if (values) {
				const list = result[key] || new Set<string>();
				if (!result[key]) {
					result[key] = list;
				}
				for (const value of values) {
					list.add(value);
				}
			}
		}
	}
	return result;
}
