import { minifyCSS } from '../../css/minify.js';
import {
	stringifyCSSAnimationFrames,
	stringifyCSSRules,
} from '../../css/stringify.js';
import type { CSSRules } from '../../css/types.js';
import type { SVGCSSIcon, SVGCSSStatefulIcon } from '../icon/types.js';
import type { SVGCSSIconSet, SVGCSSIconSetClassData } from './types.js';

function minifyRules(value: string | CSSRules | undefined): string | undefined {
	// Minify, return undefined if empty
	return (
		(value
			? minifyCSS(
					typeof value === 'string' ? value : stringifyCSSRules(value)
				)
			: undefined) || undefined
	);
}

function stringifyObject(
	data: Record<string, string | CSSRules> | undefined
): Record<string, string> | undefined {
	if (data) {
		const result = Object.create(null) as Record<string, string>;
		for (const key in data) {
			result[key] = minifyCSS(
				typeof data[key] === 'string'
					? data[key]
					: stringifyCSSRules(data[key])
			);
		}
		return result;
	}
}

/**
 * Add icon to an icon set
 */
export function addIconToSVGCSSIconSet(
	iconSet: SVGCSSIconSet,
	iconName: string,
	icon: SVGCSSIcon | SVGCSSStatefulIcon
) {
	// Add icon data
	iconSet.icons[iconName] = {
		content: icon.content,
		fallback: icon.fallback,
		states: (icon as SVGCSSStatefulIcon).states,
		viewBox: icon.viewBox,
	};

	// Add classes
	const { classes, animations, statefulClasses, keyframes } =
		icon as SVGCSSStatefulIcon;
	const classNames = new Set([
		...Object.keys(classes || {}),
		...Object.keys(statefulClasses || {}),
	]);
	for (const className of classNames) {
		// Do not add if exists: should have exactly the same content because class name should be hashed from content
		if (!iconSet.classes?.[className]) {
			const classData: SVGCSSIconSetClassData = {};
			iconSet.classes = iconSet.classes || Object.create(null);
			iconSet.classes![className] = classData;

			// Base data
			const r = classes?.[className];
			if (r) {
				classData.r = minifyRules(r);
			}

			const a = animations?.[className];
			if (a) {
				classData.a = minifyRules(a);
			}

			// Stateful data
			const statefulClass = statefulClasses?.[className];
			if (statefulClass) {
				const { stateRules, transition, stateTransition } =
					statefulClass;

				if (stateRules) {
					classData.sr = stringifyObject(stateRules);
				}
				if (transition) {
					classData.t = minifyRules(transition);
				}
				if (stateTransition) {
					classData.st = stringifyObject(stateTransition);
				}
			}
		}
	}

	// Add keyframes
	if (keyframes) {
		iconSet.keyframes = iconSet.keyframes || Object.create(null);
		const iconSetKeyframes = iconSet.keyframes!;
		for (const keyframeName in keyframes) {
			if (!iconSetKeyframes[keyframeName]) {
				const value = keyframes[keyframeName];
				iconSetKeyframes[keyframeName] =
					typeof value === 'string'
						? value
						: minifyCSS(stringifyCSSAnimationFrames(value));
			}
		}
	}
}
