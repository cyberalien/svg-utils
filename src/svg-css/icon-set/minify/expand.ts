import { expandItem } from '../../../helpers/data/expand.js';
import type { SVGCSSIconSet, SVGCSSIconSetClassData } from '../types.js';
import { iconSetMinifySimpleKeys, iconSetMinifyStatefulKeys } from './keys.js';

/**
 * Expand class content from icon set
 */
export function expandSVGCSSIconSetClass(
	css: Required<SVGCSSIconSet>['css'],
	classContent: SVGCSSIconSetClassData
) {
	// Base rules
	for (const prop of iconSetMinifySimpleKeys) {
		if (css[prop]) {
			expandItem(
				css[prop],
				classContent as unknown as Record<string, unknown>,
				prop
			);
		}
	}

	// Stateful rules
	for (const prop of iconSetMinifyStatefulKeys) {
		const value = classContent[prop];
		const list = css[prop];
		if (list && value) {
			for (const state in value) {
				expandItem(list, value, state);
			}
		}
	}
}

/**
 * Unminify icon set
 */
export function expandSVGCSSIconSet(iconSet: SVGCSSIconSet) {
	const { viewBoxes, statesList, css } = iconSet;

	// Parse all icons
	if (viewBoxes || statesList) {
		for (const iconName in iconSet.icons) {
			const icon = iconSet.icons[iconName];
			if (viewBoxes) {
				expandItem(
					viewBoxes,
					icon as unknown as Record<string, unknown>,
					'viewBox'
				);
			}
			if (statesList) {
				expandItem(
					statesList,
					icon as unknown as Record<string, unknown>,
					'states'
				);
			}
		}

		delete iconSet.viewBoxes;
		delete iconSet.statesList;
	}

	// Parse all classes
	if (css && iconSet.classes) {
		for (const className in iconSet.classes) {
			expandSVGCSSIconSetClass(css, iconSet.classes[className]);
		}

		delete iconSet.css;
	}
}
