import { iterateXMLContent } from '../../xml/iterate.js';
import type { ParsedXMLTagElement } from '../../xml/types.js';
import type {
	ConvertSVGPropertyToCSSOptions,
	SVGConvertedToCSSProperties,
} from './types.js';
import { convertSVGPropertyToCSS } from './convert.js';
import { svgAnimateTransformTag, svgAnimationTag, svgSetTag } from './tags.js';

/**
 * Extract SVG tag properties that can be converted to CSS
 *
 * Returns CSS rules, does not add a class to tag, but does remove properties from tag
 */
export function extractSVGTagPropertiesForCSS(
	tag: ParsedXMLTagElement,
	options: ConvertSVGPropertyToCSSOptions = {}
): SVGConvertedToCSSProperties | undefined {
	const result: SVGConvertedToCSSProperties = {
		props: [],
		rules: Object.create(null),
	};

	// Get animated properties
	const animatedProps = new Set<string>();
	iterateXMLContent(tag.children, (node) => {
		if (node.type === 'tag') {
			switch (node.tag) {
				case svgSetTag:
				case svgAnimationTag: {
					// Animate attribute
					const prop = node.attribs.attributeName;
					if (typeof prop === 'string') {
						animatedProps.add(prop);
					}
					break;
				}

				case svgAnimateTransformTag:
					// Animate transformation
					animatedProps.add('transform');
					break;
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
				options
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
