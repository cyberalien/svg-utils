import type { ParsedXMLTagElement } from '../../xml/types.js';

// Supported values for some attributes, fails if unsupported value is found
const supportedValues: Record<string, string> = {
	additive: 'replace',
	accumulate: 'none',
};

/**
 * Check for common failures
 *
 * Returns true on success
 */
export function checkAnimationTagForCompatibility(
	node: ParsedXMLTagElement
): boolean | undefined {
	if (node.children.length) {
		// Cannot have children
		return;
	}

	// Animation tag found. Check attributes
	const attribs = node.attribs;
	for (const attr in supportedValues) {
		if (attribs[attr] && attribs[attr] !== supportedValues[attr]) {
			// Unsupported value
			return;
		}
	}
}
