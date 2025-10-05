import { sortObject } from './sort-object.js';

/**
 * Compare sets, returns true if identical
 */
export function compareSets<T>(
	set1: Set<T> | undefined,
	set2: Set<T> | undefined
) {
	if (!set1 || !set2) {
		return false;
	}
	if (set1.size !== set2.size) {
		return false;
	}
	for (const value of set1) {
		if (!set2.has(value)) {
			return false;
		}
	}
	return true;
}

/**
 * Compare two values, returns true if identical
 */
export function compareValues<T>(value1: T, value2: T) {
	return (
		// Check for strict equality
		value1 === value2 ||
		// Check for stringified equality
		JSON.stringify(sortObject(value1)) ===
			JSON.stringify(sortObject(value2))
	);
}
