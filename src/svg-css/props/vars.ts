import type { ConvertSVGPropertyVariableCallback } from './types.js';

// Callback for color
const colorVar: ConvertSVGPropertyVariableCallback = (color) =>
	color === 'currentcolor'
		? undefined
		: `--svg-color--${color
				// Replace with dashes
				.replace(/[^a-z0-9]/g, '-')
				// Remove dashes at the beginning and end
				.replace(/^-+|-+$/g, '')
				// Replace multiple dashes with a single dash
				.replace(/-+/g, '-')}`;

/**
 * Default CSS variable callbacks for SVG properties
 */
export const defaultSVGCSSPropertyVars: Record<
	string,
	ConvertSVGPropertyVariableCallback
> = {
	// Colors
	'stroke': colorVar,
	'fill': colorVar,
	'stop-color': colorVar,

	// Stroke width
	'stroke-width': (value) => `--svg-stroke-width--${value}`,

	// Opacity
	'opacity': (value) => `--svg-opacity--${value}`,
	'fill-opacity': (value) => `--svg-fill-opacity--${value}`,
};
