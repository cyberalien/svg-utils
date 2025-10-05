import type { CSSRules } from '../../css/types.js';

/**
 * Result of converting SVG properties to CSS
 */
export interface SVGConvertedToCSSProperties {
	// List of converted properties
	props: string[];

	// Converted CSS
	rules: CSSRules;
}
