import { iterateXMLContent } from '../../xml/iterate.js';
import type { ParsedXMLTagElement } from '../../xml/types.js';
import type { ChangeIDResult } from './types.js';

/**
 * Remove duplicate IDs from SVG
 */
export function removeUnusedIDs(
	root: ParsedXMLTagElement[],
	data: ChangeIDResult
): ParsedXMLTagElement[] {
	const remove = new Set<string>();

	for (const id in data.usage) {
		if (!data.usage[id].length) {
			// No nodes using this ID: remove it
			remove.add(id);
		}
	}

	if (remove.size) {
		return iterateXMLContent(root, (node, stack) => {
			if (node.type !== 'tag') {
				return;
			}

			const id = node.attribs.id;
			if (typeof id !== 'string' || !remove.has(id)) {
				return;
			}

			// Remove this node, if it is not used
			switch (node.tag) {
				case 'mask':
				case 'clipPath':
				case 'symbol':
					return 'remove';
			}

			const parentNode = stack[stack.length - 1];
			if (parentNode?.tag === 'defs') {
				// Reusable element
				return 'remove';
			}

			// Node might be used: remove ID
			delete node.attribs.id;
		});
	}
	return root;
}
