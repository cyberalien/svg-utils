import { stringifyStylesheet } from '../../../css/stylesheet.js';
import type { CSSGeneratedStylesheet } from '../../../css/types.js';
import type { ComponentFactorySource } from '../../types/source.js';

/**
 * Convert icon content to a string literal
 */
export function stringifyFactoryIconContent(
	icon: Omit<ComponentFactorySource, 'viewBox' | 'fallback' | 'states'>,
	embedCSS?: CSSGeneratedStylesheet,
	addQuotes = true
): string {
	const style = embedCSS ? stringifyStylesheet(embedCSS) : '';
	const fullContent = style
		? `<style>${style}</style>${icon.content}`
		: icon.content;
	return addQuotes
		? '`' + fullContent.replace(/`/g, '\\`') + '`'
		: fullContent;
}
