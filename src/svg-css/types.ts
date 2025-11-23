import type { CSSHashOptions, CSSKeyframes, CSSRules } from '../css/types.js';
import type { StringifyXMLOptions } from '../xml/types.js';

/**
 * Options for converting SVG tags to SVG+CSS
 */
export interface BaseConvertSVGContentOptions {
	// Class name prefix
	classNamePrefix?: string;

	// Hash options
	hashOptions?: CSSHashOptions;

	// Support legacy browsers
	legacy?: boolean;
}

/**
 * Options for converting SVG content to SVG+CSS
 */
export interface ConvertSVGContentOptions
	extends StringifyXMLOptions,
		BaseConvertSVGContentOptions {
	//
}

/**
 * Result of converting SVG content to SVG+CSS
 */
export interface ConvertedSVGContent {
	// Content
	content: string;

	// Classes
	classes?: Record<string, CSSRules>;

	// Keyframes
	keyframes?: Record<string, CSSKeyframes>;
}
