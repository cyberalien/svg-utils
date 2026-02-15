/**
 * States for stateful icons
 */
// Boolean state: true/false
export type IconStatesSimpleState = Readonly<string>;

// Values for advanced state
export type IconStatesAdvancedStateValues = string[] | Readonly<string[]>;

// Advanced state
// If the third element is present, it is the default value for the state
// Otherwise, the default value is the first value in the array of values
export type IconStatesAdvancedState = Readonly<
	| [string, IconStatesAdvancedStateValues]
	| [string, IconStatesAdvancedStateValues, string]
>;

// State can be either simple or advanced
export type IconStatesState = IconStatesSimpleState | IconStatesAdvancedState;

// Array of states
export type IconStatesList = IconStatesState[];
