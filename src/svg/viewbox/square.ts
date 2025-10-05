import type { IconViewBox } from './types.js';

/**
 * Make viewBox square
 */
export function makeSquareViewBox(viewBox: IconViewBox): IconViewBox {
	const { width, height } = viewBox;
	if (width === height) {
		// No changes
		return {
			...viewBox,
		};
	}

	if (width >= height) {
		// Adjust vertically
		const diff = (width - height) / 2;
		return {
			left: viewBox.left,
			top: (viewBox.top ?? 0) - diff,
			width,
			height: width,
		};
	}

	// Adjust horizontally, taking into account cx
	const cx = viewBox.cx ?? width / 2 + (viewBox.left ?? 0);
	return {
		left: cx - height / 2,
		top: viewBox.top,
		width: height,
		height: height,
	};
}
