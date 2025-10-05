import type { ParsedXMLTagElement } from './types.js';

/**
 * Parse SVG content
 *
 * Returns null on error
 */
export function parseXMLContent(
	content: string,
	trim = true
): ParsedXMLTagElement[] | null {
	// Stack
	const stack: ParsedXMLTagElement[] = [];
	const rootNodes: ParsedXMLTagElement[] = [];
	let startIndex = 0;
	let parentNode: ParsedXMLTagElement | null = null;

	do {
		// Find next tag
		const start = content.indexOf('<', startIndex);
		const end = start === -1 ? -1 : content.indexOf('>', start);
		if (start === -1 || end === -1) {
			// No tag detected
			const text = content.slice(startIndex).trim();
			if (text || parentNode || !rootNodes.length) {
				// Failed: text after closing tag or not all tags are closed
				return null;
			}
			return rootNodes;
		}

		// Check for comment
		if (content.slice(start, start + 4) === '<!--') {
			const end = content.indexOf('-->', start);
			if (end === -1) {
				// Failed: comment not closed
				return null;
			}
			startIndex = end + 3;
			continue;
		}

		// Add content before tag to output
		const rawText = content.slice(startIndex, start);
		const text = trim ? rawText.trim() : rawText;
		startIndex = start;
		if (text) {
			if (!parentNode) {
				// Text in root is not supported
				return null;
			}
			parentNode.children.push({
				type: 'text',
				content: text,
			});
		}

		// Get tag content
		let tagContent = content.slice(start + 1, end).trim();

		// Check if it is a closing tag
		if (tagContent.startsWith('/')) {
			if (!parentNode) {
				// Failed: no tag to close
				return null;
			}

			// Check if the closing tag matches the opening tag
			const tagNameMatch = tagContent.slice(1).match(/^[^\s]+/);
			if (parentNode.tag !== tagNameMatch?.[0]) {
				// Failed: closing tag does not match opening tag
				return null;
			}

			// Remove element from stack
			stack.pop();
			parentNode = stack.length ? stack[stack.length - 1] : null;

			// Continue
			startIndex = end + 1;
			continue;
		}

		// Parse tag name
		const tagNameMatch = tagContent.match(/^[^\s/]+/);
		if (!tagNameMatch) {
			// Something is wrong
			return null;
		}
		const tagName = tagNameMatch[0];
		tagContent = tagContent.slice(tagName.length).trim();

		// Check for self-closing tag
		const selfClosing = tagContent.slice(-1) === '/';
		if (selfClosing) {
			tagContent = tagContent.slice(0, -1).trim();
		}

		// Get attributes
		const attribs = Object.create(null) as Record<string, string>;
		Array.from(tagContent.matchAll(/([\w:-]+)="([^"]*)"/g) ?? []).forEach(
			(match) => {
				// [0] = full match, [1] = key, [2] = value
				attribs[match[1]] = match[2];
			}
		);

		// Create element, run callback
		const element: ParsedXMLTagElement = {
			type: 'tag',
			tag: tagName,
			attribs,
			children: [],
		};

		// Add to parent element
		if (parentNode) {
			parentNode.children.push(element);
		} else {
			rootNodes.push(element);
		}

		// Check for self closing tag
		if (!selfClosing) {
			// Add to stack
			stack.push(element);
			parentNode = element;
		}

		// Update start index
		startIndex = end + 1;

		// Find end of style
		if (tagName === 'style' && !selfClosing) {
			const match = '</style>';
			const end = content.indexOf(match, startIndex);
			if (end === -1) {
				return null;
			}

			// Get CSS
			const css = content.slice(startIndex, end).trim();
			if (css.length) {
				parentNode!.children.push({
					type: 'text',
					content: css,
				});
			}

			// Close tag
			stack.pop();
			parentNode = stack.length ? stack[stack.length - 1] : null;

			// Update index
			startIndex = end + match.length;
		}

		// eslint-disable-next-line no-constant-condition
	} while (true);
}
