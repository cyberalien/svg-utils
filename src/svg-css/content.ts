import { parseXMLContent } from '../xml/parse.js';
import { stringifyXMLContent } from '../xml/stringify.js';
import { convertSVGRootToCSS } from './root.js';
import type { ConvertedSVGContent, ConvertSVGContentOptions } from './types.js';

/**
 * Convert SVG content string to SVG+CSS
 */
export function convertSVGContentToCSSRules(
	content: string,
	options: ConvertSVGContentOptions
): ConvertedSVGContent {
	const root = parseXMLContent(content);
	if (!root) {
		// Failed to parse
		return { content };
	}

	const classes = convertSVGRootToCSS(root, options);
	if (classes) {
		const newContent = stringifyXMLContent(root, options);
		if (newContent) {
			return {
				content: newContent,
				classes,
			};
		}
	}

	// Failed or no changes
	return { content };
}
