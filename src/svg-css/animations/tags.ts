/**
 * Tag used to set attribute value without animation duration
 */
export const svgSetTag = 'set';

/**
 * Tag to discard animation
 */
export const svgDiscardTag = 'discard';

/**
 * Attribute animation tag
 */
export const svgAnimationTag = 'animate';

/**
 * Tags for animating one attribute in SVG
 */
export const svgSimpleAnimationTags = [
	svgSetTag,
	svgDiscardTag,
	svgAnimationTag,
];

/**
 * Tag for animating transformations in SVG
 */
export const svgAnimateTransformTag = 'animateTransform';

/**
 * Tag for animating motion in SVG
 */
export const svgAnimateMotionTag = 'animateMotion';

/**
 * All tags for animating SVG
 */
export const svgAnimationTags = [
	...svgSimpleAnimationTags,
	svgAnimateTransformTag,
	svgAnimateMotionTag,
];
