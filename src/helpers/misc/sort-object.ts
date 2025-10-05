/**
 * Sort object keys to generate consistend JSON output
 *
 * Used to hash objects
 */
export function sortObject<T>(data: T): T {
	if (typeof data !== 'object' || data === null) {
		// Nothing to do
		return data;
	}

	if (Array.isArray(data)) {
		// Sort arrays
		return data.map(sortObject) as T;
	}

	if (data instanceof Set) {
		// Sort sets
		const values = Array.from(data).map(sortObject);
		values.sort();
		return new Set(values) as T;
	}

	// Object
	const keys = Object.keys(data);
	keys.sort();
	const newObject = Object.create(null) as T;
	for (const key of keys) {
		newObject[key as keyof T] = sortObject(data[key as keyof T]);
	}
	return newObject;
}
