import type { StateSelectorSubParts } from '../types.js';

function mergeSet(set: Set<string> | undefined): string {
	return set
		? Array.from(set)
				.sort((a, b) => a.localeCompare(b))
				.join('')
		: '';
}

/**
 * Convert selector parts to string
 */
export function stringifySelectorSubParts(
	selector: StateSelectorSubParts,
	isSVG = false
): string {
	const combinator = selector.combinator ? `& ${selector.combinator} ` : '';
	const tag = isSVG ? '' : `${selector.tag || ''}${selector.id || ''}`;
	const attr = `${mergeSet(selector.name)}${mergeSet(selector.attr)}`;
	const pseudo = mergeSet(selector.pseudo);

	// Full content without combinator
	const full = `${tag}${attr}${pseudo}`;
	if (isSVG) {
		// Add svg tag if there are any parts, to prevent conflicts with non-svg selectors
		return full ? `${combinator}svg${full}` : combinator.trim();
	}
	// Add wildcard if there are only pseudo selectors
	return `${combinator}${pseudo && full === pseudo ? '*' : ''}${full}`;
}
