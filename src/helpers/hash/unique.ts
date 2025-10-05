import { sortObject } from '../misc/sort-object.js';
import { hashToString } from './stringify.js';
import { hashString } from './hash.js';
import type { UniqueHashOptions } from './types.js';

// Cache for collision test: [prefix + hash] = stringified object
const uniqueHashes = Object.create(null) as Record<string, string>;
const uniqueWithPrefixHashes = Object.create(null) as Record<string, string>;

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
	const { length, lengths, css } = options;
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

	const cache = hasPrefix ? uniqueWithPrefixHashes : uniqueHashes;
	const result = `${prefix}${hash}`;
	if (!cache[result]) {
		// Store hash
		cache[result] = str;
	} else if (cache[result] !== str) {
		// Already exists and is different
		// In case of collision, increase limit in hashToCSSString()
		const msg = `Hash collision detected: ${hash}`;
		if (options.throwOnCollision) {
			throw new Error(msg);
		} else {
			console.warn(msg);
		}
	}
	return result;
}
