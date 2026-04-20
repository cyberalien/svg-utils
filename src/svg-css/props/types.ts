import type { CSSRules } from '../../css/types.js';

/**
 * Callback type for generating CSS variable name based on value
 */
export type ConvertSVGPropertyVariableCallback = (
	lowerCaseValue: string
) => string;

/**
 * Options for converting SVG properties to CSS
 */
export interface ConvertSVGPropertyToCSSOptions {
	// Support legacy browsers
	legacy?: boolean;

	// Add CSS variables for other properties can be added here
	vars?: Record<string, ConvertSVGPropertyVariableCallback>;
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
