import { iterateXMLContent } from '../xml/iterate.js';
import type { ParsedXMLTagElement } from '../xml/types.js';
import { createCSSClassName } from '../css/hash.js';
import { toggleClassName } from '../classname/toggle.js';
import { extractSVGTagPropertiesForCSS } from './props/props.js';
import type { CSSRules } from '../css/types.js';
import type { BaseConvertSVGContentOptions } from './types.js';

/**
 * Convert SVG tags tree to SVG+CSS
 *
 * Returns used CSS class names with rules
 */
export function convertSVGRootToCSS(
	root: ParsedXMLTagElement[],
	options: BaseConvertSVGContentOptions
): Record<string, CSSRules> {
	const rules = Object.create(null) as Record<string, CSSRules>;

	iterateXMLContent(root, (node) => {
		if (node.type === 'tag') {
			const props = extractSVGTagPropertiesForCSS(node, options);
			if (props) {
				const className = createCSSClassName(props.rules, options);
				toggleClassName(node.attribs, className, true);
				rules[className] = props.rules;
			}
		}
	});

	return rules;
}
