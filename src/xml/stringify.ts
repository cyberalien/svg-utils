import type { ParsedXMLNode, StringifyXMLOptions } from './types.js';

const defaultOptions: Required<StringifyXMLOptions> = {
	useSelfClosing: true,
	numberTemplate: ` {key}="{value}"`,
	prettyPrint: false,
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function assertNever(v: never) {
	//
}

/**
 * Convert parsed XML content to string
 */
export function stringifyXMLContent(
	root: ParsedXMLNode[],
	options?: StringifyXMLOptions
): string | null {
	const fullOptions = {
		...defaultOptions,
		...options,
	};
	const { prettyPrint } = fullOptions;
	let output = '';

	// Tabs
	const tab =
		typeof prettyPrint === 'string' ? prettyPrint : prettyPrint ? '\t' : '';
	const tabs = (length: number): string => tab.repeat(length);
	const nl = prettyPrint === false ? '' : '\n';

	// Add tag
	const add = (node: ParsedXMLNode, depth: number): boolean | undefined => {
		if (node.type !== 'tag') {
			// Not a tag
			output += node.content;
			return true;
		}

		// Add tag start
		output += tabs(depth) + '<' + node.tag;
		for (const key in node.attribs) {
			const value = node.attribs[key];
			switch (typeof value) {
				case 'string':
					output += ` ${key}="${value}"`;
					break;

				case 'number':
					output += fullOptions.numberTemplate
						.replace('{value}', value.toString())
						.replace('{key}', key);
					break;
			}
		}

		// Close tag if no children
		if (!node.children.length) {
			if (fullOptions.useSelfClosing) {
				output += (prettyPrint ? ' ' : '') + '/>' + nl;
			} else {
				output += '></' + node.tag + '>' + nl;
			}
			return true;
		}
		output += '>' + nl;

		// Parse children
		for (let i = 0; i < node.children.length; i++) {
			const childNode = node.children[i];
			switch (childNode.type) {
				case 'tag':
					if (!add(childNode, depth + 1)) {
						return false;
					}
					break;

				case 'text':
					output += childNode.content;
					break;

				default:
					assertNever(childNode);
			}
		}

		// Close tag
		output += tabs(depth) + '</' + node.tag + '>' + nl;
		return true;
	};

	// Parse root nodes
	for (const node of root) {
		if (!add(node, 0)) {
			return null;
		}
	}
	return output;
}
