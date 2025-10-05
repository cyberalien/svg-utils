import { iterateXMLContent } from '../../xml/iterate.js';
import { stringifyXMLContent } from '../../xml/stringify.js';
import type { ParsedXMLTagElement } from '../../xml/types.js';
import { changeIDInString } from './string.js';
import type { ChangeIDResult } from './types.js';

type HashCallback = (id: string, content: string, tagName: string) => string;

/**
 * Change IDs in SVG using a callback function
 */
export function changeSVGIDs(
	root: ParsedXMLTagElement[],
	callback: HashCallback
): ChangeIDResult {
	// Map nodes to IDs
	const idMap = new Map<ParsedXMLTagElement, string>();
	const idNodes = new Map<string, ParsedXMLTagElement>();

	// Map all IDs used within ID
	const nestedIDs = new Map<string, string[]>();

	// Result
	const results: ChangeIDResult = {
		map: Object.create(null),
		usage: Object.create(null),
	};

	interface UsageItem {
		node: ParsedXMLTagElement;
		attrib: string;
		id: string;
	}
	const usage: UsageItem[] = [];

	// Callback to parse root
	const parse = (replacement?: [string, string]) => {
		iterateXMLContent(root, (node, stack) => {
			if (node.type !== 'tag') {
				return;
			}
			const attribs = node.attribs;

			// Get ID (to be used in stack)
			const nodeID = attribs.id;
			if (typeof nodeID === 'string') {
				if (!replacement) {
					if (idNodes.has(nodeID)) {
						throw new Error(`Duplicate ID found: ${nodeID}`);
					}
					idNodes.set(nodeID, node);
					idMap.set(node, nodeID);
				} else if (nodeID === replacement[0]) {
					const newID = replacement[1];
					attribs.id = newID;

					// Add to results
					if (!results.map[newID]) {
						results.map[newID] = [node];
					} else {
						results.map[newID].push(node);
					}
				}
			}

			// Check all attributes
			for (const attrib in attribs) {
				const value = attribs[attrib];
				if (typeof value !== 'string') {
					continue;
				}

				const add = (id: string) => {
					// Add to used IDs
					usage.push({
						node,
						attrib,
						id,
					});

					// Add to stack
					[node, ...stack].forEach((node) => {
						const parentID = idMap.get(node);
						if (parentID) {
							const nested = nestedIDs.get(parentID) || [];
							if (!nested.includes(id)) {
								nested.push(id);
								nestedIDs.set(parentID, nested);
							}
						}
					});
				};

				switch (attrib) {
					case 'id':
						break;

					// Animation timing attributes
					// begin="some-id.begin;other-id.end+0.2s"
					case 'begin':
					case 'end': {
						const newValue = value
							.split(';')
							.map((part) => {
								const chunks = part.trim().split('.');
								if (chunks.length < 2) {
									return part;
								}

								const time = chunks[1];
								if (
									time?.startsWith('begin') ||
									time?.startsWith('end')
								) {
									// Most likely a reference to an ID
									const id = chunks.shift()!;
									if (!replacement) {
										add(id);
									} else if (id === replacement[0]) {
										return `${replacement[1]}.${chunks.join(
											'.'
										)}`;
									}
								}
								return part;
							})
							.join(';');
						if (replacement) {
							attribs[attrib] = newValue;
						}
						break;
					}

					// Link
					case 'href':
					case 'xlink:href': {
						if (value.startsWith('#')) {
							const id = value.slice(1);
							if (!replacement) {
								add(id);
							} else if (id === replacement[0]) {
								attribs[attrib] = `#${replacement[1]}`;
							}
						}
						break;
					}

					// Many attributes can include url()
					default: {
						if (value.startsWith('url(#')) {
							const id = value.slice(5, -1);
							if (!replacement) {
								add(id);
							} else if (id === replacement[0]) {
								attribs[attrib] = `url(#${replacement[1]})`;
							}
						}
					}
				}
			}
		});
	};

	// Find all IDs
	parse();
	if (!idMap.size) {
		return results;
	}

	// Sort IDs by usage
	const allIDs = new Set(idMap.values());
	const parseIDs = (parseAll = false) => {
		const oldSize = allIDs.size;

		for (const id of allIDs) {
			// Find IDs it depends on
			const nested =
				nestedIDs
					.get(id)
					?.filter(
						(nestedID) => nestedID !== id && allIDs.has(nestedID)
					) ?? [];
			if (parseAll || !nested.length) {
				// No nested IDs, safe to replace
				const node = idNodes.get(id)!;

				// Stringify node, remove ID
				const content = stringifyXMLContent([node]);
				if (!content) {
					throw new Error(`Failed to stringify node with ID: ${id}`);
				}
				const cleanedContent = changeIDInString(content, id, '{id}');

				// Generate new ID
				const newID = callback(id, cleanedContent, node.tag);

				if (newID !== id) {
					// Replace ID in all nodes
					parse([id, newID]);
				}
				allIDs.delete(id);

				// Add usage
				const idUsage: ParsedXMLTagElement[] = [];
				for (const item of usage) {
					if (item.id === id) {
						idUsage.push(item.node);
					}
				}
				results.usage[newID] = idUsage;
			}
		}

		return allIDs.size !== oldSize;
	};

	// Parse IDs until no more changes
	while (allIDs.size) {
		if (!parseIDs()) {
			// Failed: parse all IDs
			parseIDs(true);
			return results;
		}
	}
	return results;
}
