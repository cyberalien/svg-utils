import { getStatesFromKey } from '../key.js';
import type { IconStatesList } from '../types.js';
import { mergeSelectorsForStates } from './merge.js';
import { splitSelectorsForState } from './split.js';
import { stringifySelectorsForState } from './stringify.js';
import type {
	StatefulIconSelectorsConfig,
	StatefulIconSelectorsContext,
	StateSelectorData,
} from './types.js';

/**
 * Create context object from config
 */
export function createStatefulIconSelectorsContext(
	config: StatefulIconSelectorsConfig,
	states: IconStatesList,
	staticClassname?: string
): StatefulIconSelectorsContext {
	return {
		config,
		states,
		staticClassname,
		data: Object.create(null),
		parsed: Object.create(null),
	};
}

/**
 * Get selectors to render state values
 *
 * Does not include shape class name
 */
export function getSelectorsForStateValues(
	context: StatefulIconSelectorsContext,
	value: string | Record<string, string | boolean>
): string[][] | null {
	const dataToMerge: StateSelectorData[] = [];
	let cacheKey = '';
	const { config, states, data, parsed } = context;

	// Get state values
	const stateValues =
		typeof value === 'string' ? getStatesFromKey(value, states) : value;

	// Function to add a selector
	const add = (key: string, value: string): boolean => {
		cacheKey += `${key}:${value};`;

		// Get config for state
		const baseStateItem = config[key];

		// Get config for value
		const stateItem =
			typeof baseStateItem === 'object' && !Array.isArray(baseStateItem)
				? baseStateItem[value]
				: baseStateItem;

		if (!stateItem) {
			// Invalid state
			return false;
		}

		// Get selector data
		let selectorData: StateSelectorData;
		if (typeof stateItem === 'string') {
			// Convert to object
			const selector = stateItem.replace('{state}', value);
			if (data[selector]) {
				selectorData = data[selector];
			} else if (data[selector] === null) {
				// Failed
				return false;
			} else {
				const split = splitSelectorsForState(selector);
				data[selector] = split;
				if (!split) {
					return false;
				}
				selectorData = split;
			}
		} else {
			selectorData = stateItem;
		}

		dataToMerge.push(selectorData);
		return true;
	};

	// Process all state values to get selectors and cache key
	for (const stateName in stateValues) {
		const stateValue = stateValues[stateName];
		const stateItem = states.find((s) =>
			typeof s === 'string' ? s === stateName : s[0] === stateName
		);
		if (!stateItem) {
			// Invalid state
			return null;
		}

		// Boolean state
		if (typeof stateItem === 'string') {
			if (stateValue && !add(stateName, stateName)) {
				// Failed to add state
				return null;
			}
		} else {
			// Named state
			const allValues = stateItem[1];
			if (
				typeof stateValue !== 'string' ||
				!allValues.includes(stateValue)
			) {
				// Invalid value
				return null;
			}
			const defaultValue = stateItem[2] || allValues[0];
			if (stateValue !== defaultValue && !add(stateName, stateValue)) {
				// Failed to add state
				return null;
			}
		}
	}

	if (!dataToMerge.length) {
		// Default selector
		return [[]];
	}

	// Check for cached result
	if (parsed[cacheKey] !== undefined) {
		return parsed[cacheKey];
	}

	// Merge data
	let merged = data[cacheKey];
	if (!merged) {
		if (merged !== null) {
			merged = mergeSelectorsForStates(dataToMerge);
			data[cacheKey] = merged;
		}
		if (!merged) {
			return null;
		}
	}

	// Stringify merged selectors
	const stringified = stringifySelectorsForState(merged);
	parsed[cacheKey] = stringified;
	return stringified;
}
