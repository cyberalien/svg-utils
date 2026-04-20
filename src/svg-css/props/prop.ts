/**
 * SVG property types
 */
const propTypes = ['path', 'px', 'raw'] as const;
type SVGPropertyType = (typeof propTypes)[number];

/**
 * Props shared between multiple shapes
 */
const commonShapes: Partial<Record<SVGPropertyType, string[]>> = {
	px: ['width', 'height', 'x', 'y', 'cx', 'cy', 'r', 'rx', 'ry'],
};

/**
 * Shape specific properties that can be converted to CSS
 */
const props: Record<string, Partial<Record<SVGPropertyType, string[]>>> = {
	'*': {
		px: ['stroke-width'],
		raw: [
			'fill',
			// 'fill-opacity',
			// 'fill-rule',
			'stroke',
			// 'stroke-opacity',
			// 'stroke-linecap',
			// 'stroke-linejoin',
			// 'stroke-dasharray',
			// 'stroke-dashoffset',
			// 'stroke-miterlimit',
			'color',
			'opacity',
		],
	},
	'path': {
		path: ['d'],
	},
	'ellipse': commonShapes,
	'circle': commonShapes,
	'rect': commonShapes,
	'stop': {
		raw: ['stop-color', 'stop-opacity'],
	},
};

const skipTags = [
	'animate',
	'animateMotion',
	'animateTransform',
	'set',
	'discard',
];

const legacyProps = ['d'];

/**
 * Get property type
 */
export function getSVGPropertyType(
	tag: string,
	prop: string,
	supportLegacyBrowsers = false
): SVGPropertyType | undefined {
	// Skip some tags
	if (skipTags.includes(tag)) {
		return;
	}

	// Make sure it is not legacy property
	if (supportLegacyBrowsers && legacyProps.includes(prop)) {
		return;
	}

	// Check for common shapes
	for (const type of propTypes) {
		if (
			props[tag]?.[type]?.includes(prop) ||
			props['*']?.[type]?.includes(prop)
		) {
			return type;
		}
	}

	// Special props
	if (prop.startsWith('stroke') || prop.startsWith('fill')) {
		return 'raw';
	}
}
