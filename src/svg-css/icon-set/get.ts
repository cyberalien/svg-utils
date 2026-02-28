import { findUsedKeyframes } from '../../css/find/animations.js';
import { findUsedClassNames } from '../../css/find/classname.js';
import type { IconViewBox } from '../../svg/viewbox/types.js';
import type {
	ExtendedSVGCSSIconClass,
	SVGCSSIcon,
	SVGCSSStatefulIcon,
} from '../icon/types.js';
import { expandSVGCSSIconSetClass } from './minify/expand.js';
import type { SVGCSSIconSet } from './types.js';

export function getSVGCSSIconFromIconSet(
	iconSet: SVGCSSIconSet,
	name: string
): SVGCSSIcon | SVGCSSStatefulIcon | undefined {
	const fullName = iconSet.aliases?.[name] || name;

	// Get base data
	const data = iconSet.icons[fullName];
	if (!data) {
		return;
	}

	// Compact data
	const {
		viewBoxes,
		css,
		fallbackPrefix = '',
		fallbackSuffix = '',
	} = iconSet;

	// Get viewBox
	let viewBox: string | number | IconViewBox | undefined = data.viewBox;
	if (typeof viewBox === 'number') {
		viewBox = viewBoxes?.[viewBox];
	}
	if (!viewBox) {
		// Failed to get viewBox
		return;
	}

	// Get supported states
	let states = data.states;
	if (typeof states === 'number') {
		states = iconSet.statesList?.[states];
	}

	// Content
	const content = data.content;

	// Find and parse used classes
	const classNames = findUsedClassNames(content);

	const classes = Object.create(null) as Record<string, string>;
	const animations = Object.create(null) as Record<string, string>;
	const statefulClasses = Object.create(null) as Record<
		string,
		ExtendedSVGCSSIconClass
	>;

	const cssLines: string[] = [];
	classNames.forEach((className) => {
		const classContent = iconSet.classes?.[className];
		if (classContent) {
			if (css) {
				// Expand class: convert all properties to string
				expandSVGCSSIconSetClass(css, classContent);
			}

			const { r, a, t, sr, st } = classContent;

			const statefulClass = Object.create(
				null
			) as ExtendedSVGCSSIconClass;

			if (r) {
				classes[className] = r as string;
				cssLines.push(r as string);
			}
			if (a) {
				animations[className] = a as string;
				cssLines.push(a as string);
			}

			// Stateful data
			if (sr) {
				const stateRules = Object.create(null) as Record<
					string,
					string
				>;
				statefulClass.stateRules = stateRules;
				for (const state in sr) {
					stateRules[state] = sr[state] as string;
					cssLines.push(sr[state] as string);
				}
			}
			if (t) {
				statefulClass.transition = t as string;
				cssLines.push(t as string);
			}
			if (st) {
				const stateTransition = Object.create(null) as Record<
					string,
					string
				>;
				statefulClass.stateTransition = stateTransition;
				for (const state in st) {
					stateTransition[state] = st[state] as string;
					cssLines.push(st[state] as string);
				}
			}

			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			for (const key in statefulClass) {
				statefulClasses[className] = statefulClass;
				break;
			}
		}
	});

	// Find used animations
	const keyframes = Object.create(null) as Record<string, string>;
	if (iconSet.keyframes) {
		const animationNames = findUsedKeyframes(cssLines.join(';'));
		animationNames.forEach((animationName) => {
			const keyframeContent = iconSet.keyframes![animationName];
			if (keyframeContent) {
				keyframes[animationName] = keyframeContent;
			}
		});
	}

	// Create result
	const result: SVGCSSStatefulIcon = {
		content,
		viewBox,
		states,
		fallback:
			typeof data.fallback === 'string'
				? `${fallbackPrefix}${data.fallback}${fallbackSuffix}`
				: undefined,
	};

	// Copy non-empty objects
	let _key: string;
	for (_key in classes) {
		result.classes = classes;
		break;
	}
	for (_key in animations) {
		result.animations = animations;
		break;
	}
	for (_key in keyframes) {
		result.keyframes = keyframes;
		break;
	}
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	for (_key in statefulClasses) {
		result.statefulClasses = statefulClasses;
		break;
	}

	return result;
}
