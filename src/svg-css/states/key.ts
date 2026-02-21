import type { IconStatesList } from './types.js';

/**
 * Get state values from an underscore separated list of state values
 */
export function getStatesFromKey(
	key: string,
	states: IconStatesList
): Record<string, string | boolean> {
	const obj = Object.create(null) as Record<string, string | boolean>;
	const parts = key.split('_');
	for (const state of states) {
		if (typeof state === 'string') {
			if (parts.includes(state)) {
				obj[state] = true;
			}
			continue;
		}

		const values = state[1];
		const defaultValue = state[2] || values[0];
		for (const value of values) {
			if (value !== defaultValue && parts.includes(value)) {
				obj[state[0]] = value;
				break;
			}
		}
	}
	return obj;
}
