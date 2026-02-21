import { splitSelectorToSubParts } from '../sub/split.js';
import type { StateSelectorParts, StateSelectorSubParts } from '../types.js';

// Characters that can be after at-rule in selector
const charAfterAtRule = ['.', '&', ':', '[', '#', '*'];

/**
 * Create selector parts from given parameters
 *
 * Should be used when selector is hard to parse from string, such as:
 * - `@media (max-width: 600px) label:focus &` -> parser will not be able to tell if "label" is part of at-rule or parent selector
 */
export function createSelectorParts(
	atRules: string[] | null,
	parentSelectors: string | string[] | null,
	svgSelector: string | null
): StateSelectorParts {
	return {
		at: atRules ? atRules : undefined,
		parents: parentSelectors
			? Array.isArray(parentSelectors)
				? parentSelectors.map(splitSelectorToSubParts)
				: [splitSelectorToSubParts(parentSelectors)]
			: undefined,
		svg: svgSelector ? splitSelectorToSubParts(svgSelector) : undefined,
	};
}

/**
 * Split selector into parts
 */
export function splitSelectorToParts(
	selector: string
): StateSelectorParts | null {
	selector = selector.replace(/[\s]+/g, ' ').trim();
	const result: StateSelectorParts = {};

	// Get at-rule
	if (selector.startsWith('@')) {
		const chunks = selector.split(' ');
		const atRule = [chunks.shift()!];

		// Check next chunk
		let isAtRuleComplete = false;
		while (chunks.length > 0) {
			const nextChunk = chunks[0]!;
			const firstChar = nextChunk[0]!;
			if (charAfterAtRule.includes(firstChar)) {
				// Next chunk is selector, stop processing at-rule
				isAtRuleComplete = true;
				break;
			}

			// Continue at rule
			atRule.push(chunks.shift()!);
		}

		if (!isAtRuleComplete) {
			// Whole selector is at-rule, add it to result and return
			return {
				at: [selector],
			};
		}
		result.at = [atRule.join(' ')];
		selector = chunks.join(' ');
	}

	// Add combinators to chunks for simple parsing
	// List of combinators must match with array in ../sub/split.ts
	selector = selector.replace(/\s*([>+~])\s*/g, ' $1').trim();

	// Parse next chunks
	const parents: StateSelectorSubParts[] = [];
	const chunks = selector.split(' ');
	while (chunks.length > 0) {
		const nextChunk = chunks.shift()!;
		if (nextChunk.includes('&')) {
			if (chunks.length) {
				// Cannot have more chunks after svg selector
				return null;
			}
			result.svg = splitSelectorToSubParts(nextChunk.replace('&', ''));
		} else {
			parents.push(splitSelectorToSubParts(nextChunk));
		}
	}
	if (parents.length) {
		result.parents = parents;
	}

	return result;
}
