import type { UniqueHashOptions } from '../helpers/hash/types.js';

/**
 * CSS rules
 */
export type CSSRules = Record<string, string>;

/**
 * Animation keyframes
 */
export interface CSSKeyframe {
	// Time, 0-1 range
	time: number;

	// Property value
	value: string;
}

export interface CSSKeyframes {
	prop: string;
	frames: CSSKeyframe[];
}

/**
 * Hash options
 */
export type CSSHashOptions = Partial<
	Pick<UniqueHashOptions, 'length' | 'lengths' | 'throwOnCollision'>
>;
