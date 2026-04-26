import { addGeneratedSelector, createEmptyStylesheet } from './stylesheet.js';
import type { CSSGeneratedSelector, CSSGeneratedStylesheet } from './types.js';

function isMediaQuery(selector: string): boolean {
	return selector.startsWith('@');
}

// Split selector into parts
function splitSelector(selector: string): string[] {
	return selector.split(',').map((part) => part.trim());
}

// Merge two lists of selectors
function mergeSelectors(list1: string[], list2: string[]): string[] {
	if (!list1.length) {
		return list2;
	}
	if (!list2.length) {
		return list1;
	}

	const newList: string[] = [];
	for (const item1 of list1) {
		for (const item2 of list2) {
			newList.push(item1 + ' ' + item2);
		}
	}
	return newList;
}

/**
 * Merge selectors for backwards compatibility with legacy CSS structure: no nested CSS
 */
export function mergeLegacyCSS(
	stylesheet: CSSGeneratedStylesheet
): CSSGeneratedStylesheet {
	const mergedStylesheet = createEmptyStylesheet();

	// Copy keyframes as is
	mergedStylesheet.keyframes = stylesheet.keyframes;

	function add(
		selector: CSSGeneratedSelector,
		media: string[],
		parent: string[]
	) {
		// Add rules
		if (selector.rules) {
			const tree = [...media];
			if (parent.length) {
				tree.push(parent.join(', '));
			}
			addGeneratedSelector(mergedStylesheet, tree, selector.rules);
		}

		// Add nested selectors
		if (selector.nested) {
			for (const nestedSelector in selector.nested) {
				const isMedia = isMediaQuery(nestedSelector);
				add(
					selector.nested[nestedSelector],
					isMedia ? [...media, nestedSelector] : media,
					isMedia
						? parent
						: mergeSelectors(parent, splitSelector(nestedSelector))
				);
			}
		}
	}
	for (const selector in stylesheet.selectors) {
		const isMedia = isMediaQuery(selector);
		add(
			stylesheet.selectors[selector],
			isMedia ? [selector] : [],
			isMedia ? [] : splitSelector(selector)
		);
	}

	return mergedStylesheet;
}
