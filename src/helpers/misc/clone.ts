/**
 * Clone object, maintaining types
 */
export function cloneObject<T>(item: T): T {
	return JSON.parse(JSON.stringify(item)) as T;
}
