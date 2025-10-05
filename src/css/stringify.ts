import type { CSSKeyframes, CSSRules } from './types.js';

function indent(depth: number) {
	return '  '.repeat(depth);
}

/**
 * Stringify CSS rules
 */
export function stringifyCSSRules(rules: CSSRules, depth = 1): string {
	const tab = indent(depth);
	const lines: string[] = [];
	for (const key in rules) {
		const value = rules[key];
		lines.push(`${tab}${key}: ${value};\n`);
	}
	return lines.join('');
}

/**
 * Stringify CSS selector with rules
 */
export function stringifyCSSSelector(
	selector: string,
	rules: string | CSSRules,
	depth = 0
): string {
	const content =
		typeof rules === 'string' ? rules : stringifyCSSRules(rules, depth + 1);
	if (!content.length) {
		return '';
	}
	const tab = indent(depth);
	return `${tab}${selector} {\n${content}${tab}}\n`;
}

/**
 * Stringify CSS keyframes
 */
export function stringifyCSSKeyframes(
	animationName: string,
	keyframes: CSSKeyframes,
	depth = 0
): string {
	const prop = keyframes.prop;
	const values = new Map<string, number[]>();
	keyframes.frames.forEach((frame) => {
		const css = `${indent(depth + 2)}${prop}: ${frame.value};\n`;
		const item = values.get(css);
		if (item) {
			item.push(frame.time);
		} else {
			values.set(css, [frame.time]);
		}
	});

	const lines: string[] = [];
	lines.push(`${indent(depth)}@keyframes ${animationName} {\n`);
	values.forEach((times, css) => {
		lines.push(
			`${indent(depth + 1)}${times
				.map(
					(time) =>
						`${(time * 100).toFixed(2).replace(/\.?0+$/, '')}%`
				)
				.join(', ')} {\n${css}${indent(depth + 1)}}\n`
		);
	});
	lines.push('}\n');
	return lines.join('');
}
