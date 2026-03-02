import type { IconViewBox } from '../../svg/viewbox/types.js';
import type { IconStatesList } from '../states/types.js';

/**
 * Icon entry in an icon set
 */
export interface SVGCSSIconSetIcon {
	// Icon content
	content: string;

	// viewBox, can be index in shared list
	viewBox: IconViewBox | string | number;

	// Fallback icon to render from Iconify API for unsupported browsers (e.g. Safari)
	// If `fallbackPrefix` is defined in the icon set, it will be added to the fallback icon name
	fallback?: string;

	// States list, can be index in shared list
	states?: IconStatesList | number;
}

/**
 * Stateful class data
 */
export interface SVGCSSIconSetClassData {
	// Base rules for the class
	// Can be index from shared CSS
	r?: string | number;

	// Animation rules for the class, which can be separated in the output CSS
	// Can be index from shared CSS
	a?: string | number;

	// Extended rules per state
	sr?: Record<string, string | number>;

	// Transition rules for state changes (for main class, not state classes)
	// Can be index from shared CSS
	t?: string | number;

	// Same as 'stateRules', but for state transitions, so it can be separated in the output CSS
	// Can be index from shared CSS
	st?: Record<string, string | number>;
}

/**
 * Shared data for icons, which can be reused in multiple icons
 */
export interface SVGCSSIconSetSharedData {
	// Classes and keyframes used in icons
	classes?: Record<string, SVGCSSIconSetClassData>;
	keyframes?: Record<string, string>;

	// Shared CSS, used to avoid repeating the same CSS in multiple classes
	css?: Partial<Record<keyof SVGCSSIconSetClassData, string[]>>;

	// viewBox values to avoid repeating them in each icon
	viewBoxes?: (IconViewBox | string)[];

	// States list to avoid repeating it in each icon
	statesList?: IconStatesList[];
}

/**
 * Icon set in SVG+CSS format
 *
 * Does not include metadata
 */
export interface SVGCSSIconSet extends SVGCSSIconSetSharedData {
	// Icon set format version
	version: 1;

	// Common fallback prefix to add to all icons
	fallbackPrefix?: string;

	// Icons
	icons: Record<string, SVGCSSIconSetIcon>;

	// Aliases
	aliases?: Record<string, string>;
}
