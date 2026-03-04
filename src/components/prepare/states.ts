import type { SVGCSSStatefulIcon } from '../../svg-css/icon/types.js';
import { parseIconFallbackTemplate } from '../../svg-css/states/fallback/parse.js';
import { createStatefulIconSelectorsContext } from '../../svg-css/states/selector/parse.js';
import type { StatefulIconSelectorsConfig } from '../../svg-css/states/selector/types.js';
import { getStateValue } from '../../svg-css/states/value.js';
import { parseViewBox } from '../../svg/viewbox/parse.js';
import type { ComponentFactoryStatefulIconRenderingOptions } from '../types/options.js';
import type {
	ComponentFactorySource,
	StatefulComponentFactorySource,
} from '../types/source.js';

/**
 * Check states for stateful icon
 */
export function prepareComponentFactoryStatefulIcon(
	icon: SVGCSSStatefulIcon,
	options?: ComponentFactoryStatefulIconRenderingOptions
): ComponentFactorySource | undefined {
	// Try to parse viewBox
	const viewBox =
		typeof icon.viewBox === 'string'
			? parseViewBox(icon.viewBox)
			: icon.viewBox;
	if (!viewBox) {
		// Invalid viewBox
		return;
	}
	const newIcon: ComponentFactorySource = {
		...icon,
		viewBox,
	};

	// Check fallback
	const fallback = icon.fallback;
	const isStatefulFallback = fallback?.includes('{');
	if (!isStatefulFallback && fallback) {
		newIcon.defaultFallback = fallback;
	}

	// Check states
	const allStates = icon.states;
	if (!allStates) {
		// Not stateful
		return newIcon;
	}

	// Get config for states and check for used states
	const config = Object.create(null) as StatefulIconSelectorsConfig;
	const customConfig = options?.stateSelectors;
	const supportedStates = new Set<string>();
	const defaultStateValues = Object.create(null) as Record<
		string,
		string | boolean
	>;
	const supportedStateValues = Object.create(null) as Record<
		string,
		string | boolean
	>;

	for (const state of allStates) {
		const stateName = typeof state === 'string' ? state : state[0];
		const defaultValue = getStateValue(state);
		defaultStateValues[stateName] = defaultValue;

		if (customConfig?.[stateName]) {
			// Use custom config for state
			config[stateName] = customConfig[stateName];
		} else {
			// Use default config
			if (state === 'focus') {
				// Focus state is special: can be triggered by external css
				config[stateName] =
					`input:focus-visible, input:hover, button:focus-visible, button:hover, &.state-${stateName}`;
			} else {
				config[stateName] = `&.state-{state}`;
			}
			supportedStates.add(stateName);
			supportedStateValues[stateName] = defaultValue;
		}
	}

	// Generate data
	const statefulData: StatefulComponentFactorySource = {
		allStates,
		supportedStates,
		defaultStateValues,
		supportedStateValues,
		context: createStatefulIconSelectorsContext(config, allStates),
	};

	// Get fallback template
	if (isStatefulFallback) {
		let fallbackTemplate = parseIconFallbackTemplate(fallback!, allStates);

		if (!fallbackTemplate) {
			// Failed to parse fallback
			return newIcon;
		}

		// Filter fallback and create default fallback
		let defaultFallback = '';
		let hasStatefulFallback = false;
		fallbackTemplate = fallbackTemplate.map((item) => {
			if (typeof item === 'string') {
				defaultFallback += item;
				return item;
			}

			// Return default value for state that is not supported
			// Boolean states will always have default value set to false
			const stateName = item.state;
			const defaultValue =
				(defaultStateValues as Record<string, string | false>)[
					stateName
				] || stateName;

			defaultFallback += defaultValue;

			if (supportedStates.has(stateName)) {
				hasStatefulFallback = true;
				return item;
			}
			return defaultValue;
		});

		if (hasStatefulFallback) {
			// Set only if there are supported states in fallback, otherwise it is not stateful
			statefulData.fallback = fallbackTemplate;
		}
		newIcon.defaultFallback = defaultFallback;
	}

	return { ...newIcon, statefulData };
}
