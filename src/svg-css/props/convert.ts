import { getSVGPropertyType } from './prop.js';
import type { ConvertSVGPropertyToCSSOptions } from './types.js';

// Values that should not be wrapped in CSS variables
const skipValues = new Set([
	'',
	'none',
	'transparent',
	'inherit',
	'initial',
	'unset',
]);

/**
 * Wrap value in CSS variable if option is set
 */
function wrapInVariable(
	value: string,
	callback?: string | ((length: string) => string)
): string {
	if (
		!skipValues.has(value.toLowerCase()) &&
		typeof callback === 'function'
	) {
		const varName = callback(value.toLowerCase());
		return varName ? `var(${varName}, ${value})` : value;
	}
	return value;
}

/**
 * Convert property to CSS
 */
export function convertSVGPropertyToCSS(
	tag: string,
	prop: string,
	value: string | number,
	options: ConvertSVGPropertyToCSSOptions = {}
): [string, string] | undefined {
	switch (getSVGPropertyType(tag, prop, options.legacy)) {
		case 'path':
			if (typeof value !== 'string') {
				return;
			}
			return [prop, `path("${value.replace(/\s+/g, ' ')}")`];

		case 'px': {
			// Convert value to string
			let fullValue =
				typeof value === 'string' && !value.match(/^[0-9.-]+$/)
					? value
					: `${value}px`;

			// Add CSS variable if needed
			fullValue = wrapInVariable(fullValue, options.vars?.[prop]);

			return [prop, fullValue];
		}

		case 'raw': {
			if (typeof value === 'string' && value.startsWith('url(')) {
				// Do not convert URLs
				return;
			}

			// Convert value to string
			let fullValue = `${value}`;

			// Add CSS variable if needed
			fullValue = wrapInVariable(fullValue, options.vars?.[prop]);

			return [prop, fullValue];
		}
	}
}
