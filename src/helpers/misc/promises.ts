import { compareKeys, type ComparisonKey } from './keys.js';

interface PromiseInstance<T> {
	resolve: (data: T) => void;
	reject: (reason?: unknown) => void;
}

interface CacheItem<T> {
	key: ComparisonKey;
	callbacks: PromiseInstance<T>[];
}
type Cache<T> = CacheItem<T>[];

let cache: Cache<unknown> = [];

/**
 * Make sure multiple instances of Promise or callback are not ran at the same time
 */
export function uniquePromise<T>(
	key: ComparisonKey,
	callback: () => T | Promise<T>
): Promise<T> {
	return new Promise((resolve, reject) => {
		const cachedItem = cache.find((item) => compareKeys(key, item.key));
		if (cachedItem) {
			// Add to queue
			(cachedItem as CacheItem<T>).callbacks.push({
				resolve,
				reject,
			});
			return;
		}

		// Not running yet: add to queue
		const newItem: CacheItem<T> = {
			key,
			callbacks: [
				{
					resolve,
					reject,
				},
			],
		};
		(cache as Cache<T>).push(newItem);

		// Resolve/reject all promises
		function done(success: boolean, result?: T | Error) {
			cache = cache.filter((item) => item !== newItem);
			newItem.callbacks.forEach((item) => {
				try {
					if (success) {
						item.resolve(result as T);
					} else {
						item.reject(result as Error);
					}
					// eslint-disable-next-line @typescript-eslint/no-unused-vars
				} catch (err2) {
					//
				}
			});
		}

		// Get Promise or callback
		let cb: T | Promise<T>;
		try {
			cb = callback();
		} catch (err) {
			done(false, err as Error);
			return;
		}

		// Run it
		if (cb instanceof Promise) {
			cb.then((data) => {
				done(true, data);
			}).catch((err) => {
				done(false, err);
			});
		} else {
			done(true, cb);
		}
	});
}
