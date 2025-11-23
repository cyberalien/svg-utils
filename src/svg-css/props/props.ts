import { iterateXMLContent } from '../../xml/iterate.js';
import type { ParsedXMLTagElement } from '../../xml/types.js';
import type { SVGConvertedToCSSProperties } from './types.js';
import { convertSVGPropertyToCSS } from './prop.js';
import {
	svgAnimateTransformTag,
	svgSimpleAnimationTags,
} from '../animations/tags.js';

/**
 * Extract SVG tag properties that can be converted to CSS
 *
 * Returns CSS rules, does not add a class to tag, but does remove properties from tag
 */
export function extractSVGTagPropertiesForCSS(
	tag: ParsedXMLTagElement,
	supportLegacyBrowsers = false
): SVGConvertedToCSSProperties | undefined {
	const result: SVGConvertedToCSSProperties = {
		props: [],
		rules: Object.create(null),
	};

	// Get animated properties
	const animatedProps = new Set<string>();
	iterateXMLContent(tag.children, (node) => {
		if (node.type === 'tag') {
			if (svgSimpleAnimationTags.includes(node.tag)) {
				const prop = node.attribs.attributeName;
				if (typeof prop === 'string') {
					animatedProps.add(prop);
				}
			}
			if (node.tag === svgAnimateTransformTag) {
				animatedProps.add('transform');
			}
		}
	});

	// Check all properties
	for (const prop in tag.attribs) {
		if (!animatedProps.has(prop)) {
			const value = tag.attribs[prop];
			const converted = convertSVGPropertyToCSS(
				tag.tag,
				prop,
				value,
				supportLegacyBrowsers
			);
			if (converted) {
				const [propName, propValue] = converted;
				result.props.push(propName);
				result.rules[propName] = propValue;
				delete tag.attribs[prop];
			}
		}
	}

	return result.props.length > 0 ? result : undefined;
}
