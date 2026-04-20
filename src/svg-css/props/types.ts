import type { CSSRules } from '../../css/types.js';

/**
 * Options for converting SVG properties to CSS
 */
export interface ConvertSVGPropertyToCSSOptions {
	// Support legacy browsers
	legacy?: boolean;
}

/**
 * Result of converting SVG properties to CSS
 */
export interface SVGConvertedToCSSProperties {
	// List of converted properties
	props: string[];

	// Converted CSS
	rules: CSSRules;
}
