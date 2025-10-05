import { iterateXMLContent } from '../xml/iterate.js';
import type { ParsedXMLTagElement } from '../xml/types.js';
import { createCSSClassName } from '../css/hash.js';
import { toggleClassName } from '../classname/toggle.js';
import { extractSVGTagPropertiesForCSS } from './props/props.js';
import type { CSSHashOptions, CSSRules } from '../css/types.js';

/**
 * Convert SVG tags tree to SVG+CSS
 *
 * Returns used CSS class names with rules
 */
export function convertSVGRootToCSS(
	root: ParsedXMLTagElement[],
	classNamePrefix = '',
	hashOptions?: CSSHashOptions
): Record<string, CSSRules> {
	const rules = Object.create(null) as Record<string, CSSRules>;

	iterateXMLContent(root, (node) => {
		if (node.type === 'tag') {
			const props = extractSVGTagPropertiesForCSS(node);
			if (props) {
				const className = createCSSClassName(
					props.rules,
					classNamePrefix,
					hashOptions
				);
				toggleClassName(node.attribs, className, true);
				rules[className] = props.rules;
			}
		}
	});

	return rules;
}
