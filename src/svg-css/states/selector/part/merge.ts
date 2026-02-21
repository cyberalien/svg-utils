import { mergeMultipleArrays } from '../helpers/iterate.js';
import { mergeMultipleSelectorSubParts } from '../sub/merge.js';
import type { StateSelectorParts, StateSelectorSubParts } from '../types.js';

/**
 * Merge all selectors
 *
 * Returns null if merge is not possible
 *
 * If multiple results are returned, all have identical at-rules and svg selectors, but different parent selectors.
 */
export function mergeSelectorParts(
	parts: StateSelectorParts[]
): StateSelectorParts[] | null {
	const atRules: string[] = [];
	let svgSelector: StateSelectorSubParts | null = null;

	// Merge all base parts
	for (const item of parts) {
		// Merge at rules
		if (item.at) {
			for (const atRule of item.at) {
				if (!atRules.includes(atRule)) {
					atRules.push(atRule);
				}
			}
		}

		// Merge SVG selectors
		if (item.svg) {
			if (!svgSelector) {
				svgSelector = item.svg;
			} else {
				svgSelector = mergeMultipleSelectorSubParts([
					svgSelector,
					item.svg,
				]);
				if (!svgSelector) {
					// Merge failed, return null
					return null;
				}
			}
		}
	}
	const baseResult: StateSelectorParts = {
		at: atRules.length > 0 ? atRules : undefined,
		svg: svgSelector || undefined,
	};

	// Merge parent selectors
	const allParentSelectors = parts
		.filter((item) => item.parents)
		.map<StateSelectorSubParts[]>((item) => item.parents!);
	const mergedParentSelectors =
		allParentSelectors.length > 1
			? mergeMultipleArrays<StateSelectorSubParts>(
					allParentSelectors,
					(a, b) => mergeMultipleSelectorSubParts([a, b])
				)
			: allParentSelectors;

	if (mergedParentSelectors.length) {
		return mergedParentSelectors.map((parents) => ({
			...baseResult,
			parents,
		}));
	} else {
		return [baseResult];
	}
}
