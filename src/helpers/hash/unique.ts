import { sortObject } from '../misc/sort-object.js';
import { hashToString } from './stringify.js';
import { hashString } from './hash.js';
import type { UniqueHashOptions } from './types.js';

/**
 * Hash an object, make sure hash is unique
 *
 * Number of unique hashes per length, with prefix for CSS:
 * 6 chars = 2b unique hashes
 * 7 chars = 78b unique hashes <-- got collision here
 * 8 chars = 2.9t unique hashes
 * 9 chars = 113t unique hashes
 *
 * Numer of unique hashes per length, with prefix for ID:
 * 6 chars = 47b unique hashes
 * 7 chars = 2.9t unique hashes
 * 8 chars = 183t unique hashes
 */
export function getUniqueHash(
	data: unknown,
	options: UniqueHashOptions
): string {
	const { length, lengths, css, context } = options;
	const prefix = options.prefix || '';

	const str =
		typeof data === 'string' ? data : JSON.stringify(sortObject(data));
	const hasPrefix = !!prefix;

	// Get hash
	const values = hashString(str);

	// Convert to string
	const defaultLength = typeof length === 'function' ? length(str) : length;
	let hash = hashToString(values, css, hasPrefix, defaultLength);
	if (lengths?.[hash]) {
		hash = hashToString(values, css, hasPrefix, lengths[hash]);
	}

	// Make sure it is unique within context
	if (!context.cache) {
		context.cache = Object.create(null);
	}
	const cache = context.cache!;

	const result = `${prefix}${hash}`;
	if (!cache[result]) {
		// Store hash
		cache[result] = str;
	} else if (cache[result] !== str) {
		// Already exists and is different
		options.onCollision?.(result, str);

		// Add numbers to hash
		let i = 1;
		while (true) {
			const newHash = `${result}${i}`;
			if (cache[newHash] === str) {
				// Already exists and is the same
				return newHash;
			}
			if (!cache[newHash]) {
				cache[newHash] = str;
				return newHash;
			}
			i++;
		}
	}

	return result;
}
