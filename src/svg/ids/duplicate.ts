import { iterateXMLContent } from '../../xml/iterate.js';
import type { ParsedXMLTagElement } from '../../xml/types.js';
import type { ChangeIDResult } from './types.js';

/**
 * Remove duplicate IDs from SVG
 */
export function removeDuplicateIDs(
	root: ParsedXMLTagElement[],
	data: ChangeIDResult
): ParsedXMLTagElement[] {
	const remove = new Set<string>();
	for (const id in data.map) {
		const nodes = data.map[id];
		if (nodes.length > 1) {
			remove.add(id);
		}
	}

	if (remove.size) {
		const removing = new Set<string>();
		return iterateXMLContent(root, (node) => {
			if (node.type !== 'tag') {
				return;
			}

			const id = node.attribs.id;
			if (typeof id !== 'string' || !remove.has(id)) {
				return;
			}
			if (removing.has(id)) {
				// Already have one item with id: remove this one
				return 'remove';
			}

			// First item with this ID: do not remove it
			removing.add(id);
		});
	}
	return root;
}
