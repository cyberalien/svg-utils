import type { IconStatesList } from './types.js';
import { getAdvancedStateDefaultValue } from './value.js';

/**
 * Create reactive object from states
 */
export function getObjectFromStates(
	states: IconStatesList
): Record<string, boolean | string> {
	const obj = Object.create(null) as Record<string, boolean | string>;
	for (const state of states) {
		if (typeof state === 'string') {
			obj[state] = false;
		} else {
			obj[state[0]] = getAdvancedStateDefaultValue(state);
		}
	}
	return obj;
}
