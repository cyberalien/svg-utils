import type { IconStatesList, IconStatesState } from './types.js';
import { getAdvancedStateDefaultValue } from './value.js';

/**
 * Generate code for object from states
 *
 * Does not include starting { and ending }
 * Last entry does not have a comma at the end
 */
export function generateObjectFromStates(states: IconStatesList): string {
	const lines: string[] = [];
	for (const state of states) {
		if (typeof state === 'string') {
			lines.push(`'${state}': false`);
		} else {
			lines.push(
				`'${state[0]}': '${getAdvancedStateDefaultValue(state)}'`
			);
		}
	}
	return lines.join(',\n\t');
}

/**
 * Generate code for TypeScript interface from state
 */
export function getStateInterface(
	state: IconStatesState,
	optional = true
): string {
	const q = optional ? '?' : '';
	return typeof state === 'string'
		? `'${state}'${q}: boolean;`
		: `'${state[0]}'${q}: ${state[1].map((value) => `'${value}'`).join(' | ')};`;
}

/**
 * Generate code for TypeScript interface from states
 *
 * Does not include starting { and ending }
 */
export function generateInterfaceFromStates(
	states: IconStatesList,
	optional = true
): string {
	return states
		.map((state) => getStateInterface(state, optional))
		.join('\n\t');
}
