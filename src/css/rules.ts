import type { CSSRules } from './types.js';

/**
 * Split rules string into object
 */
export function splitCSSRules(rules: CSSRules | string): CSSRules {
	if (typeof rules === 'string') {
		const result: CSSRules = Object.create(null);
		const parts = rules.split(';');
		for (const part of parts) {
			const [key, value] = part.split(':').map((s) => s.trim());
			if (key && value) {
				result[key] = value;
			}
		}
		return result;
	}
	return rules;
}

/**
 * Merge rules
 */
export function mergeCSSRules(
	rules: CSSRules | string,
	oldRules?: CSSRules | string
): CSSRules {
	return {
		...splitCSSRules(oldRules || {}),
		...splitCSSRules(rules),
	};
}
