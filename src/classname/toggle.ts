import { defaultClassProp } from './const.js';

/**
 * Split class name by spaces
 */
export function splitClassName(className: string): string[] {
	return className.trim().split(/\s+/);
}

/**
 * Add/remove class name
 */
export function toggleClassName(
	attribs: Record<string, unknown>,
	className: string,
	add: boolean,
	prop: string = defaultClassProp
) {
	const oldValue = attribs[prop];
	if (typeof oldValue !== 'string') {
		attribs[prop] = className;
		return;
	}

	const list = new Set(oldValue.split(/\s+/g));
	if (!add) {
		if (!list.has(className)) {
			return;
		}
		list.delete(className);
	} else {
		if (list.has(className)) {
			return;
		}
		list.add(className);
	}
	attribs[prop] = Array.from(list).sort().join(' ');
}
