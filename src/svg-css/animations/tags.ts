/**
 * Tags for animating one attribute in SVG
 */
export const svgSimpleAnimationTags = ['animate', 'set', 'discard'];

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
