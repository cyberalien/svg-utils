// Context item
interface ContextItemData<T> {
	// Item to minify
	parent: Record<string, unknown>;

	// Key to minify
	key: string;

	// Actual non-string value, key is used to compare values
	actualValue?: T;
}

// Context
interface ContextItem<T> {
	// Map based on values
	// If item is a number, it is index in shared data
	// If item is an object, it is previously added item waiting for minification
	// If two items have the same value, they will be minified to the same index
	map: Map<string, ContextItemData<T> | number>;

	// Minified data
	data: T[];
}

/**
 * Create context item for minification
 */
export function createCompactContext<T>(): ContextItem<T> {
	return {
		map: new Map<string, number>(),
		data: [] as T[],
	};
}

/**
 * Minify item
 *
 * If value is not a string, set it in `actualValue` and string `value` for comparison
 */
export function compactItem<T>(
	context: ContextItem<T>,
	stringifiedValue: string,
	parent: Record<string, unknown>,
	key: string,
	actualValue?: T
) {
	const { map, data } = context;
	const existing = map.get(stringifiedValue);
	if (typeof existing === 'number') {
		// Value already exists, use index
		parent[key] = existing;
		return;
	}

	const value = (actualValue ?? stringifiedValue) as T;

	if (existing) {
		// Value already exists, but not yet minified, add to data and update map
		const index = data.length;
		data.push(value);
		map.set(stringifiedValue, index);
		parent[key] = index;
		existing.parent[existing.key] = index;
		return;
	}

	// New value, add to map and set value
	map.set(stringifiedValue, { parent, key });
	parent[key] = value;
}
