import { stringifyStylesheet } from '../../../css/stylesheet.js';
import type { CSSGeneratedStylesheet } from '../../../css/types.js';
import type { ComponentFactorySource } from '../../types/source.js';

/**
 * Convert icon content to a string literal
 */
export function stringifyFactoryIconContent(
	icon: ComponentFactorySource,
	embedCSS?: CSSGeneratedStylesheet
): string {
	const style = embedCSS ? stringifyStylesheet(embedCSS) : '';
	const fullContent = style
		? `<style>${style}</style>${icon.content}`
		: icon.content;
	return '`' + fullContent.replace(/`/g, '\\`') + '`';
}
