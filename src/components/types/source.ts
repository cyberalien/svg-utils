import type { CSSKeyframes, CSSRules } from '../../css/types.js';
import type { ConvertedSVGContent } from '../../svg-css/types.js';

/**
 * Content for component factory
 */
export interface ComponentFactorySource
	extends Omit<ConvertedSVGContent, 'classes' | 'keyframes'> {
	// Classes, can be strings
	classes?: Record<string, CSSRules | string>;

	// Keyframes, can be strings
	keyframes?: Record<string, CSSKeyframes | string>;
}
