import type { ParsedXMLTagElement } from '../../xml/types.js';
import { getSVGPropertyType } from '../props/prop.js';

interface CheckResult {
	attributeName: string;
	type: ReturnType<typeof getSVGPropertyType>;
}

/**
 * Get animated attribute name and type
 */
export function getAnimatedAttributeData(
	node: ParsedXMLTagElement,
	stack: ParsedXMLTagElement[],
	supportLegacyBrowsers?: boolean
): undefined | CheckResult {
	// Get parent tag name
	const parentNode = stack[stack.length - 1];
	if (!parentNode) {
		// Cannot find parent tag
		return;
	}
	const parentTag = parentNode.tag;

	// Get parent tag name
	const attributeName = node.attribs.attributeName;
	if (typeof attributeName !== 'string') {
		// Missing attribute name
		return;
	}

	// Get attribute type
	const type = getSVGPropertyType(
		parentTag,
		attributeName,
		supportLegacyBrowsers
	);
	return type ? { attributeName, type } : undefined;
}
