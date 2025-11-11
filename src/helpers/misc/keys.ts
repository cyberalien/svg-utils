import { sortObject } from './sort-object.js';

export type ComparisonKey = string | number | symbol | object;

/**
 * Compare keys, return true on match
 */
export function compareKeys(key1: ComparisonKey, key2: ComparisonKey): boolean {
	if (key1 === key2) {
		// Match
		return true;
	}
	if (
		typeof key1 !== 'object' ||
		typeof key2 !== 'object' ||
		!key1 ||
		!key2
	) {
		// Not objects or one is null
		return false;
	}

	// Compare object keys
	const str1 = JSON.stringify(sortObject(key1));
	const str2 = JSON.stringify(sortObject(key2));
	return str1 === str2;
}
