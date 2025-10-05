import type { ParsedXMLTagElement, ParsedXMLNode } from './types.js';

/**
 * Callback result
 *
 * - void: continue
 * - 'remove': remove current node
 * - 'skip': skip children
 * - 'abort': stop iteration
 */
type CallbackResult = void | 'remove' | 'skip' | 'abort';

export function iterateXMLContent<
	T extends ParsedXMLTagElement | ParsedXMLNode
>(
	root: T[],
	callback: (
		node: ParsedXMLNode,
		stack: ParsedXMLTagElement[]
	) => CallbackResult
): T[] {
	const stack: ParsedXMLTagElement[] = [];
	let aborted = false;

	function parseChildren(nodes: ParsedXMLNode[]): ParsedXMLNode[] {
		const remove: ParsedXMLNode[] = [];
		for (const node of nodes) {
			if (parse(node) === 'remove') {
				remove.push(node);
			}
		}
		return remove.length
			? nodes.filter((item) => !remove.includes(item))
			: nodes;
	}

	function parse(node: ParsedXMLNode) {
		if (aborted) {
			return;
		}

		// Call callback
		const result = callback(node, stack);
		switch (result) {
			case 'abort': // Stop iteration
				aborted = true;
			// eslint-disable-next-line no-fallthrough
			case 'remove': // Remove node from parent
			case 'skip': // Skip children
				return result;
		}

		// Parse children
		if (node.type === 'tag') {
			stack.push(node);
			node.children = parseChildren(node.children);
			stack.pop();
		}
	}

	return parseChildren(root) as T[];
}
