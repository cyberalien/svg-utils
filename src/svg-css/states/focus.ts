import type { IconStatesList, IconStatesState } from './types.js';

/**
 * Check for focus state
 */
export function isFocusState(state: IconStatesState | string): boolean {
	return state === 'focus';
}

/**
 * Filter out focus state from states list
 */
export function filterFocusState(states: IconStatesList): IconStatesList {
	return states.filter((state) => !isFocusState(state));
}
