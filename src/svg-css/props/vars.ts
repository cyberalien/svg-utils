import type { ConvertSVGPropertyVariableCallback } from './types.js';

function cleanupValue(value: string): string {
	return (
		value
			// Replace non-number/letters with dashes
			.replace(/[^a-z0-9]/g, '-')
			// Replace multiple dashes with a single dash
			.replace(/-+/g, '-')
			// Remove dashes at the beginning and end, unless value starts with a dash (for negative numbers)
			.replace(value.startsWith('-') ? /-+$/g : /^-+|-+$/g, '')
	);
}

// Callback for color
const colorVar: ConvertSVGPropertyVariableCallback = (color) =>
	color === 'currentcolor'
		? undefined
		: `--svg-color--${cleanupValue(color)}`;

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
	'stroke-width': (value) => `--svg-stroke-width--${cleanupValue(value)}`,

	// Opacity
	'opacity': (value) => `--svg-opacity--${cleanupValue(value)}`,
	'fill-opacity': (value) => `--svg-fill-opacity--${cleanupValue(value)}`,
};
