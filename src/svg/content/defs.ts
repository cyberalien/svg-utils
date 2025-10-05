interface SplitSVGDefsResult {
	defs: string;
	content: string;
}

/**
 * Extract definitions from SVG
 *
 * Can be used with other tags, but name kept for backwards compatibility.
 * Should be used only with tags that cannot be nested, such as masks, clip paths, etc.
 */
export function splitSVGDefs(
	content: string,
	tag = 'defs'
): SplitSVGDefsResult {
	let defs = '';
	let index: number;
	while ((index = content.indexOf('<' + tag)) !== -1) {
		// Find start of defs content
		const start = content.indexOf('>', index);
		if (start === -1) {
			break;
		}

		// Save previous content
		const prevContent = content.slice(0, index).trim();

		// Check if self-closing tag
		if (content[start - 1] === '/') {
			content = prevContent + content.slice(start + 1);
			continue;
		}

		// Find closing tag
		const end = content.indexOf('</' + tag);
		if (end === -1) {
			// Fail
			break;
		}
		const endEnd = content.indexOf('>', end);
		if (endEnd === -1) {
			break;
		}
		defs += content.slice(start + 1, end).trim();
		content = prevContent + content.slice(endEnd + 1);
	}

	return {
		defs,
		content,
	};
}

/**
 * Merge defs and content
 */
export function mergeDefsAndContent(defs: string, content: string): string {
	return defs ? `<defs>${defs}</defs>${content}` : content;
}

/**
 * Wrap SVG content, without wrapping definitions
 */
export function wrapSVGContent(
	body: string,
	start: string,
	end: string
): string {
	const split = splitSVGDefs(body);
	return mergeDefsAndContent(split.defs, start + split.content + end);
}
