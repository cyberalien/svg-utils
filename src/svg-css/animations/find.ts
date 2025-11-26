import { iterateXMLContent } from '../../xml/iterate.js';
import type { ParsedXMLTagElement } from '../../xml/types.js';
import { getAnimatedAttributeData } from './attribute.js';
import { checkAnimationTagForCompatibility } from './common.js';
import {
	svgAnimateMotionTag,
	svgAnimateTransformTag,
	svgAnimationTag,
	svgSetTag,
} from './tags.js';
import type {
	FindSVGAnimationsOptions,
	SVGAnimationsContext,
} from './types.js';

/**
 * Find all animations in SVG tree
 *
 * @todo Implement this
 */
export function findAnimationsInSVGTree(
	root: ParsedXMLTagElement[],
	options: FindSVGAnimationsOptions
): SVGAnimationsContext {
	const animatedProperties = new Map<ParsedXMLTagElement, Set<string>>();
	let failed = false;
	const context: SVGAnimationsContext = {
		failed,
		animatedProperties,
	};

	iterateXMLContent(root, (node, stack) => {
		if (context.failed || node.type !== 'tag') {
			return;
		}
		switch (node.tag) {
			case svgAnimateMotionTag: {
				// AnimateMotion is not supported
				failed = true;
				return 'abort';
			}

			case svgAnimateTransformTag: {
				if (!checkAnimationTagForCompatibility(node)) {
					failed = true;
					return 'abort';
				}

				// TODO
				failed = true;
				return 'abort';
			}

			case svgSetTag:
			case svgAnimationTag: {
				if (!checkAnimationTagForCompatibility(node)) {
					failed = true;
					return 'abort';
				}
				break;
			}

			default:
				return;
		}

		// Get animated property
		const animatedProp = getAnimatedAttributeData(
			node,
			stack,
			options.supportLegacyBrowsers
		);
		if (!animatedProp) {
			failed = true;
			return 'abort';
		}

		// TODO
	});

	return failed ? { failed: true } : context;
}
