import type { IconViewBox } from '../../../svg/viewbox/types.js';

/**
 * Get viewBox ratio as string
 */
export function getViewBoxRatio(viewBox: IconViewBox): string {
	const ratio = viewBox.width / viewBox.height;
	return (Math.ceil(ratio * 100) / 100).toFixed(2).replace(/\.?0+$/, '');
}
