import type { IconStatesAdvancedState, IconStatesState } from './types.js';

/**
 * Get default value for advanced state
 */
export function getAdvancedStateDefaultValue(
	state: IconStatesAdvancedState
): string {
	return state.length === 3 ? state[2] : state[1][0];
}

/**
 * Get value for state
 */
export function getStateValue(
	state: IconStatesState,
	value?: string | boolean | undefined
): string | boolean {
	if (typeof state === 'string') {
		// Boolean state
		// Set to true if value is truthy, except for 'false' and '0' strings
		return !!value && value !== 'false' && value !== '0';
	}

	// Advanced state
	return typeof value !== 'string' || !state[1].includes(value)
		? getAdvancedStateDefaultValue(state)
		: value;
}
