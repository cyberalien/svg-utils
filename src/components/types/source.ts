import type { SVGCSSStatefulIcon } from '../../svg-css/icon/types.js';
import type { IconFallbackTemplate } from '../../svg-css/states/fallback/types.js';
import type { StatefulIconSelectorsContext } from '../../svg-css/states/selector/types.js';
import type { IconStatesList } from '../../svg-css/states/types.js';
import type { IconViewBox } from '../../svg/viewbox/types.js';

/**
 * Generated data for stateful icon
 */
export interface StatefulComponentFactorySource {
	// Fallback template, validated for states
	fallback?: IconFallbackTemplate;

	// All states
	allStates: IconStatesList;

	// Supported states, if any
	supportedStates: Set<string>;

	// Default values for all states and supported states
	defaultStateValues: Record<string, string | boolean>;
	supportedStateValues: Record<string, string | boolean>;

	// Context for rendering CSS
	context: StatefulIconSelectorsContext;
}

/**
 * Content for component factory
 */
export interface ComponentFactorySource extends Omit<
	SVGCSSStatefulIcon,
	'viewBox' | 'fallback' | 'states'
> {
	// Parsed viewBox value
	viewBox: IconViewBox;

	// Parsed fallback value
	defaultFallback?: string;

	// Stateful data
	statefulData?: StatefulComponentFactorySource;
}
