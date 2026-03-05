import type { StateSelectorSubParts } from '../types.js';

// List of combinators must match with regex in ../part/split.ts
export const combinators = new Set(['>', '+', '~']);

/**
 * Split selector into smaller parts
 *
 * Assuming selector is in format: '.foo[bar="baz"]:hover:active'
 * Class name should be before attribute selector, pseudo-classes should be last
 */
export function splitSelectorToSubParts(
	selector: string
): StateSelectorSubParts {
	const result: StateSelectorSubParts = {};

	// Check for combinator
	const firstChar = selector[0];
	if (combinators.has(firstChar)) {
		result.combinator = firstChar;
		selector = selector.slice(1).trim();
	}

	// Get pseudo selectors
	const pseudoMatches = selector.matchAll(/:[a-z-]+(\(:[a-z-]+\))*/g);
	for (const match of pseudoMatches) {
		const value = match[0];
		selector = selector.replace(value, '');
		const list = result.pseudo || new Set<string>();
		if (!result.pseudo) {
			result.pseudo = list;
		}
		list.add(value);
	}

	// Get attribute selectors
	const attrMatches = selector.matchAll(/\[[^\]]+\]/g);
	for (const match of attrMatches) {
		const value = match[0];
		selector = selector.replace(value, '');
		const list = result.attr || new Set<string>();
		if (!result.attr) {
			result.attr = list;
		}
		list.add(value);
	}

	// Check for tag name
	const tagMatch = selector.match(/^[a-zA-Z][a-zA-Z0-9-]*/);
	if (tagMatch) {
		result.tag = tagMatch![0]!;
		selector = selector.slice(result.tag.length);
	}

	// Check for ID
	const idMatch = selector.match(/^#[a-zA-Z0-9_-]+/);
	if (idMatch) {
		result.id = idMatch![0]!;
		selector = selector.slice(result.id.length);
	}

	// Remaining selector is class name
	if (selector) {
		const chunks = selector.split('.');
		const list = new Set<string>();
		for (let i = 1; i < chunks.length; i++) {
			list.add((i === 1 ? `${chunks[0]}.` : '.') + chunks[i]!);
		}
		result.name = list;
	}
	return result;
}
