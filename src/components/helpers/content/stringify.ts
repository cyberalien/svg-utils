import type { ComponentFactorySource } from '../../types/source.js';

/**
 * Convert icon content to a string literal
 */
export function stringifyFactoryIconContent(
	icon: ComponentFactorySource,
	embedCSS?: string
): string {
	const fullContent = embedCSS
		? `<style>${embedCSS}</style>${icon.content}`
		: icon.content;
	return '`' + fullContent.replace(/`/g, '\\`') + '`';
}
