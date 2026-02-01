import { getUniqueHash } from '../../helpers/hash/unique.js';
import type { ParsedXMLTagElement } from '../../xml/types.js';
import { changeSVGIDs } from './change.js';
import type { UniqueIDOptions } from './types.js';

/**
 * Create unique IDs for SVG elements
 */
export function createUniqueIDs(
	root: ParsedXMLTagElement[],
	options: UniqueIDOptions
) {
	changeSVGIDs(root, (id, content) =>
		getUniqueHash(content, {
			css: false,
			prefix: 'SVG',
			length: 8,
			...options,
		})
	);
}
