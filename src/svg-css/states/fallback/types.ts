/**
 * Fallback replacement for boolean state
 */
export interface IconFallbackBooleanState {
	// State name
	state: string;

	// Values: [false, true]
	values: [string, string];
}

/**
 * Fallback for named state
 *
 * Value should match state values
 */
export interface IconFallbackAdvancedState {
	// State name
	state: string;
}

/**
 * Template for fallback: mix of strings and states
 */
export type IconFallbackTemplate = (
	| string
	| IconFallbackBooleanState
	| IconFallbackAdvancedState
)[];
