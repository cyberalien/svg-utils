import { splitSelectorToParts } from './part/split.js';
import { stringifySelectorSubParts } from './sub/stringify.js';
import type { StateSelectorData, StateSelectorParts } from './types.js';

/**
 * Split comma separated selectors into parts, group by compatibility so later can be merged
 */
export function splitSelectorsForState(
	selectors: string
): StateSelectorData | null {
	const groups: StateSelectorData = [];
	const hashMap = new Map<string, StateSelectorParts[]>();

	const list = selectors.split(',').map((s) => s.trim());
	for (const selector of list) {
		const split = splitSelectorToParts(selector);
		if (!split) {
			// If one fails, whole function fails
			return null;
		}

		// Hash by at-rule and svg selector, so later we can merge compatible selectors
		const hash = JSON.stringify({
			at: split.at,
			svg: split.svg
				? stringifySelectorSubParts(split.svg, true)
				: undefined,
		});

		const group = hashMap.get(hash);
		if (group) {
			group.push(split);
		} else {
			const newGroup = [split];
			hashMap.set(hash, newGroup);
			groups.push(newGroup);
		}
	}

	return groups;
}
