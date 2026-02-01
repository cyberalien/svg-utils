import type { UniqueHashPartialOptions } from '../../helpers/hash/types.js';
import type { ParsedXMLTagElement } from '../../xml/types.js';

export interface ChangeIDResult {
	// Map of new IDs to nodes that have this ID
	map: Record<string, ParsedXMLTagElement[]>;

	// Usage of each ID
	usage: Record<string, ParsedXMLTagElement[]>;
}

export type UniqueIDOptions = UniqueHashPartialOptions;
