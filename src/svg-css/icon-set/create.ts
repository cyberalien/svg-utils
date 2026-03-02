import type { SVGCSSIconSet } from './types.js';

/**
 * Create an empty icon set
 */
export function createEmptySVGCSSIconSet(): SVGCSSIconSet {
	return {
		version: 1,
		icons: Object.create(null),
	};
}
