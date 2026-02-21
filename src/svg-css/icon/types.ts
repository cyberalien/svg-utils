import type { CSSKeyframes, CSSRules } from '../../css/types.js';
import type { IconViewBox } from '../../svg/viewbox/types.js';
import type { IconStatesList } from '../states/types.js';

/**
 * Main properties
 */
interface MainProps {
	// Icon viewBox
	viewBox: IconViewBox | string;

	// Fallback icon to render from Iconify API for unsupported browsers (e.g. Safari)
	fallback?: string;

	// Content
	content: string;
}

interface StatefulMainProps extends MainProps {
	// List of supported states
	states?: IconStatesList;
}

/**
 * CSS data
 */
export interface SVGCSSIconRules {
	// Classes
	classes?: Record<string, CSSRules | string>;

	// Animations for classes
	// Same as 'classes', but for animation properties, so it can be separated in the output CSS
	animations?: Record<string, CSSRules | string>;

	// Keyframes
	keyframes?: Record<string, CSSKeyframes | string>;
}

/**
 * Extended class interface for stateful icons
 */
interface ExtendedSVGCSSIconClass {
	// Extended rules per state
	stateRules?: Record<string, CSSRules | string>;

	// Transition rules for state changes (for main class, not state classes)
	transition?: CSSRules | string;

	// Same as 'stateRules', but for state transitions, so it can be separated in the output CSS
	stateTransition?: Record<string, CSSRules | string>;

	// There are no state animation rules because animations cannot be transitioned, so they should be stateless
}

/**
 * Stateful CSS data
 */
export interface SVGCSSStatefulIconRules extends SVGCSSIconRules {
	// Stateful classes
	statefulClasses?: Record<string, ExtendedSVGCSSIconClass>;
}

/**
 * Icon data
 */
export interface SVGCSSIcon extends MainProps, SVGCSSIconRules {
	//
}

/**
 * Icon with states
 */
export interface SVGCSSStatefulIcon
	extends StatefulMainProps, SVGCSSStatefulIconRules {
	//
}
