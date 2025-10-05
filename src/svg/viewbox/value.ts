import type { IconViewBox } from './types.js';

/**
 * Convert IconViewBox to string
 */
export function stringifyIconViewBox(viewBox: IconViewBox): string {
	return `${viewBox.left ?? 0} ${viewBox.top ?? 0} ${viewBox.width} ${
		viewBox.height
	}`;
}
