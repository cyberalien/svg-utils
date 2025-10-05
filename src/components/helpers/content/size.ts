import { calculateSize } from '../../../svg/props/size.js';
import type { IconViewBox } from '../../../svg/viewbox/types.js';
import type { ComponentFactoryRenderingOptions } from '../../types/options.js';

interface SizeResult {
	width: string;
	height: string;
}

/**
 * Get size values for component
 */
export function getComponentSizeValues(
	options: Pick<
		ComponentFactoryRenderingOptions,
		'width' | 'height' | 'square'
	>,
	viewBox: IconViewBox
): SizeResult | undefined {
	const { width, height, square } = options;

	// Check if both width and height are set
	if (width && height) {
		// Return as is, square is ignored
		return { width, height };
	}

	// One of props is set
	if (height) {
		return {
			width: square
				? height
				: calculateSize(height, viewBox.width / viewBox.height),
			height,
		};
	}
	if (width) {
		return {
			width,
			height: square
				? width
				: calculateSize(width, viewBox.height / viewBox.width),
		};
	}

	// No hardcoded values
}
