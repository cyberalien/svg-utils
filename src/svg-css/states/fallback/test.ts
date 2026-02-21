import type { IconStatesList } from '../types.js';
import { parseIconFallbackTemplate } from './parse.js';
import type { IconFallbackTemplate } from './types.js';

const match = /^[a-z0-9:-]*$/;

/**
 * Parse and test fallback template string
 *
 * This will make sure template is valid and does not contain invalid characters
 */
export function parseAndTestIconFallbackTemplate(
	fallback: string,
	states: IconStatesList
): IconFallbackTemplate | undefined {
	const template = parseIconFallbackTemplate(fallback, states);
	if (template) {
		for (const chunk of template) {
			if (typeof chunk === 'string') {
				if (!chunk.match(match)) {
					return;
				}
			} else if ('values' in chunk) {
				if (!chunk.values.every((v) => v.match(match))) {
					return;
				}
			}
		}
	}
	return template;
}
