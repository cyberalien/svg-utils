import {
	addGeneratedSelector,
	createEmptyStylesheet,
} from '../../../css/stylesheet.js';
import type { CSSGeneratedStylesheet } from '../../../css/types.js';
import { prefersReduceMotion } from '../../../helpers/reduce-motion.js';
import type { SVGCSSIcon } from '../types.js';

/**
 * Add styles for icon to stylesheet
 *
 * If commonStylesheet is an object, all styles will be added to it and result
 * will contain the same stylesheet for all classes.
 *
 * If commonStylesheet is not an object, styles will be separated into different
 * stylesheets for classes and keyframes, which can be reused across icons.
 */
export function renderSVGCSSIconStyle(
	icon: SVGCSSIcon,
	commonStylesheet:
		| CSSGeneratedStylesheet
		| ((selector: string) => CSSGeneratedStylesheet) = createEmptyStylesheet
): Record<string, CSSGeneratedStylesheet> {
	const stylesheets = Object.create(null) as Record<
		string,
		CSSGeneratedStylesheet
	>;

	const getStylesheet = (className: string): CSSGeneratedStylesheet => {
		if (typeof commonStylesheet === 'object') {
			return commonStylesheet;
		}
		if (!stylesheets[className]) {
			stylesheets[className] = commonStylesheet(className);
		}
		return stylesheets[className];
	};

	// Add base classes
	for (const className in icon.classes) {
		addGeneratedSelector(
			getStylesheet(className),
			[`.${className}`],
			icon.classes[className]
		);
	}

	// Add animations
	for (const className in icon.animations) {
		addGeneratedSelector(
			getStylesheet(className),
			[prefersReduceMotion, `.${className}`],
			icon.animations[className]
		);
	}

	// Add keyframes
	for (const keyframeName in icon.keyframes) {
		getStylesheet(keyframeName).keyframes[keyframeName] =
			icon.keyframes[keyframeName];
	}

	return stylesheets;
}
