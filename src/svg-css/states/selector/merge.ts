import { mergeSelectorParts } from './part/merge.js';
import type { StateSelectorData, StateSelectorParts } from './types.js';

/**
 * Merge sets of StateSelectorData into one
 */
export function mergeSelectorsForStates(
	data: StateSelectorData[]
): StateSelectorData | null {
	const groupedResults = Object.create(null) as Record<
		string,
		StateSelectorParts[]
	>;

	const next = (
		parents: StateSelectorParts[],
		key: string,
		index: number
	): boolean => {
		if (index >= data.length) {
			// Reached end of data, add merged selector to results
			const merged = mergeSelectorParts(parents);
			if (!merged) {
				return false;
			}
			if (!groupedResults[key]) {
				groupedResults[key] = [];
			}
			groupedResults[key].push(...merged);
			return true;
		}

		const group = data[index];
		if (!group.length) {
			return false;
		}

		for (let i = 0; i < group.length; i++) {
			const items = group[i];
			const nextKey = `${key}:${i}`;
			for (const item of items) {
				if (!next([...parents, item], nextKey, index + 1)) {
					return false;
				}
			}
		}

		return true;
	};
	if (!next([], '', 0)) {
		return null;
	}

	return Object.values(groupedResults);
}
