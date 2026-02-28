import type { SVGCSSIconSet } from './types.js';

/**
 * Create an empty icon set
 */
export function createEmptySVGCSSIconSet(): SVGCSSIconSet {
	return {
		icons: Object.create(null),
	};
}
