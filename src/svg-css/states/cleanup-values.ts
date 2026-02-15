import type { IconStatesList } from './types.js';
import { getStateValue } from './value.js';

/**
 * Clean up state values object
 */
export function cleanupStateValues(
	states: IconStatesList,
	values: Record<string, boolean | string>,
	clone = false
) {
	const result = clone ? { ...values } : values;
	for (const state of states) {
		const stateName = typeof state === 'string' ? state : state[0];
		result[stateName] = getStateValue(state, result[stateName]);
	}
	return result;
}
