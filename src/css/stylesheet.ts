import { stringifyCSSKeyframes, stringifyCSSSelector } from './stringify.js';
import type {
	CSSGeneratedSelectors,
	CSSGeneratedStylesheet,
	CSSRules,
} from './types.js';

/**
 * Create empty stylesheet
 */
export function createEmptyStylesheet(): CSSGeneratedStylesheet {
	return {
		selectors: Object.create(null),
		keyframes: Object.create(null),
	};
}

/**
 * Add generated selector to stylesheet
 *
 * If item exists, it will be overwritten. Class names should be hashed to avoid conflicts, so this should not cause issues.
 */
export function addGeneratedSelector(
	stylesheet: CSSGeneratedStylesheet,
	tree: string[],
	rules: CSSRules | string
) {
	let parent = stylesheet.selectors;
	for (let i = 0; i < tree.length; i++) {
		const selector = tree[i];
		if (!parent[selector]) {
			parent[selector] = {};
		}
		const parentItem = parent[selector];

		if (i === tree.length - 1) {
			parentItem.rules = rules;
			return;
		}
		if (!parentItem.nested) {
			parentItem.nested = Object.create(null);
		}
		parent = parentItem.nested!;
	}
}

function indent(depth: number) {
	return '  '.repeat(depth);
}

/**
 * Stringify generated selectors to CSS string
 */
function stringifySelectors(data: CSSGeneratedSelectors, depth = 0): string {
	const lines: string[] = [];
	for (const selector in data) {
		const item = data[selector];
		if (item.rules) {
			lines.push(stringifyCSSSelector(selector, item.rules, depth));
		}
		if (item.nested) {
			const nestedContent = stringifySelectors(item.nested, depth + 1);
			if (nestedContent.length) {
				lines.push(
					`${indent(depth)}${selector} {\n${nestedContent}${indent(depth)}}\n`
				);
			}
		}
	}
	return lines.join('\n');
}

/**
 * Stringify generated stylesheet to CSS string
 */
export function stringifyStylesheet(
	stylesheet: CSSGeneratedStylesheet
): string {
	const lines: string[] = [];

	const selectors = stringifySelectors(stylesheet.selectors);
	if (selectors.length) {
		lines.push(selectors);
	}

	for (const animationName in stylesheet.keyframes) {
		const keyframes = stylesheet.keyframes[animationName];
		const keyframesContent = stringifyCSSKeyframes(
			animationName,
			keyframes
		);
		if (keyframesContent.length) {
			lines.push(keyframesContent);
		}
	}

	return lines.join('\n');
}
