import { getUniqueHash } from '../../helpers/hash/unique.js';
import type { ParsedXMLTagElement } from '../../xml/types.js';
import { changeSVGIDs } from './change.js';

// Hash length
const length = 8;

// Custom lengths
const lengths: Record<string, number> = {};

/**
 * Create unique IDs for SVG elements
 */
export function createUniqueIDs(root: ParsedXMLTagElement[], prefix = 'SVG') {
	changeSVGIDs(root, (id, content) =>
		getUniqueHash(content, {
			css: false,
			prefix,
			length,
			lengths,
		})
	);
}
