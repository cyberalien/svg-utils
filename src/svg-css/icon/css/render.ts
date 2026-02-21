import {
	addGeneratedSelector,
	createEmptyStylesheet,
} from '../../../css/stylesheet.js';
import type { CSSGeneratedStylesheet } from '../../../css/types.js';
import { prefersReduceMotion } from '../../../helpers/reduce-motion.js';
import { getSelectorsForStateValues } from '../../states/selector/parse.js';
import type { StatefulIconSelectorsContext } from '../../states/selector/types.js';
import type { SVGCSSIconRules, SVGCSSStatefulIconRules } from '../types.js';

type StylesheetParam =
	| CSSGeneratedStylesheet
	| ((selector: string) => CSSGeneratedStylesheet);

/**
 * Add styles for stateful icon to stylesheet
 *
 * If commonStylesheet is an object, all styles will be added to it and result
 * will contain the same stylesheet for all classes.
 *
 * If commonStylesheet is not an object, styles will be separated into different
 * stylesheets for classes and keyframes, which can be reused across icons.
 */
export function renderStatefulSVGCSSIconStyle(
	icon: SVGCSSStatefulIconRules,
	context: StatefulIconSelectorsContext | null,
	commonStylesheet: StylesheetParam = createEmptyStylesheet
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

	// Add stateful classes
	if (context) {
		for (const className in icon.statefulClasses) {
			const baseClassName = `.${className}`;
			const stylesheet = getStylesheet(className);
			const classData = icon.statefulClasses[className];

			// Transitions
			if (classData.transition) {
				addGeneratedSelector(
					getStylesheet(className),
					[prefersReduceMotion, baseClassName],
					classData.transition
				);
			}

			// State specific rules
			for (const stateKey in classData.stateRules) {
				const selectors = getSelectorsForStateValues(context, stateKey);
				if (selectors) {
					for (const tree of selectors) {
						addGeneratedSelector(
							stylesheet,
							[...tree, baseClassName],
							classData.stateRules[stateKey]
						);
					}
				}
			}
			for (const stateKey in classData.stateTransition) {
				const selectors = getSelectorsForStateValues(context, stateKey);
				if (selectors) {
					for (const tree of selectors) {
						addGeneratedSelector(
							stylesheet,
							[prefersReduceMotion, ...tree, baseClassName],
							classData.stateTransition[stateKey]
						);
					}
				}
			}
		}
	}

	return stylesheets;
}

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
	icon: SVGCSSIconRules,
	commonStylesheet?: StylesheetParam
): Record<string, CSSGeneratedStylesheet> {
	return renderStatefulSVGCSSIconStyle(icon, null, commonStylesheet);
}
