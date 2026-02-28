import type { SVGCSSIconSetClassData } from '../types.js';

export const iconSetMinifySimpleKeys: (keyof Pick<
	SVGCSSIconSetClassData,
	'r' | 'a' | 't'
>)[] = ['r', 'a', 't'] as const;

export const iconSetMinifyStatefulKeys: (keyof Pick<
	SVGCSSIconSetClassData,
	'sr' | 'st'
>)[] = ['sr', 'st'] as const;

// All keys that can be minified
export const iconSetMinifyKeys: (keyof SVGCSSIconSetClassData)[] = [
	...iconSetMinifySimpleKeys,
	...iconSetMinifyStatefulKeys,
] as const;
