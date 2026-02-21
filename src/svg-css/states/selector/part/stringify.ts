import { stringifySelectorSubParts } from '../sub/stringify.js';
import type { StateSelectorParts, StateSelectorSubParts } from '../types.js';

/**
 * Join sub-parts of selector into one string
 */
function joinSubParts(parts: StateSelectorSubParts[]): string {
	return parts
		.map((item, index) => {
			const chunk = stringifySelectorSubParts(item);
			// Remove & from middle of selector
			return index > 0 && chunk.startsWith('&')
				? chunk.replace('&', '').trim()
				: chunk;
		})
		.join(' ');
}

/**
 * Convert selector parts to array of strings
 *
 * Assumes that all parts have identical at-rules and svg selectors, but different parent selectors,
 * same as returned by mergeSelectorParts()
 */
export function stringifySelectorParts(
	parts: StateSelectorParts[]
): string[] | null {
	const firstItem = parts[0];
	if (!firstItem) {
		return null;
	}

	// Add at rules
	const results: string[] = [];
	if (firstItem.at) {
		results.push(...firstItem.at);
	}

	// Add parent selectors
	if (parts.length > 1) {
		// Merge chain of parent selectors into one set of unique selectors
		const parentSelectors = new Set<string>();
		for (const item of parts) {
			if (item.parents) {
				parentSelectors.add(joinSubParts(item.parents));
			}
		}
		if (parentSelectors.size) {
			results.push(
				Array.from(parentSelectors)
					.sort((a, b) => a.localeCompare(b))
					.join(', ')
			);
		}
	} else if (firstItem.parents) {
		results.push(
			...firstItem.parents.map((item) => stringifySelectorSubParts(item))
		);
	}

	// Add svg selector
	if (firstItem.svg) {
		results.push(stringifySelectorSubParts(firstItem.svg, true));
	}

	return results;
}
