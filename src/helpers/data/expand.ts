/**
 * Expand minified item
 */
export function expandItem<T>(
	list: T[],
	parent: Record<string, unknown>,
	key: string
) {
	const index = parent[key];
	if (typeof index === 'number' && list[index]) {
		parent[key] = list[index];
	}
}
