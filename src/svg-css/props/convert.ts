import { getSVGPropertyType } from './prop.js';
import type { ConvertSVGPropertyToCSSOptions } from './types.js';

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
			if (typeof value === 'string' && !value.match(/^[0-9.-]+$/)) {
				return [prop, value];
			}
			return [prop, `${value}px`];
		}

		case 'raw':
			if (typeof value === 'string' && value.startsWith('url(')) {
				// Do not convert URLs
				return;
			}
			return [prop, `${value}`];
	}
}
