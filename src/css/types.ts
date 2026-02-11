import type { UniqueHashPartialOptions } from '../helpers/hash/types.js';

/**
 * CSS rules
 */
export type CSSRules = Record<string, string>;

/**
 * Animation keyframes
 */
export interface CSSKeyframe {
	// Time, 0-1 range
	time: number;

	// Property value
	value: string;
}

export interface CSSKeyframes {
	prop: string;
	frames: CSSKeyframe[];
}

/**
 * Hash options
 */
export type CSSHashOptions = UniqueHashPartialOptions;

/**
 * Generated stylesheet
 */
export interface CSSGeneratedSelector {
	// Rules for this selector, if any
	rules?: CSSRules | string;

	// Nested selectors, e.g. for media queries
	nested?: CSSGeneratedSelectors;
}

export type CSSGeneratedSelectors = Record<string, CSSGeneratedSelector>;

export interface CSSGeneratedStylesheet {
	// Selectors and their rules
	selectors: CSSGeneratedSelectors;

	// Keyframes
	keyframes: Record<string, CSSKeyframes>;
}
