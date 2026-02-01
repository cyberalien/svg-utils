import type { HashContext } from './types.js';

/**
 * Create new hash context, used to make sure all hashes within the same context are unique
 */
export function createUniqueHashContext(): HashContext {
	return {
		cache: Object.create(null),
	};
}
