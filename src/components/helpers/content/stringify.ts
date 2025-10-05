import { generateCSSDefaultImportName } from '../css/name.js';
import type { ComponentFactoryRenderingOptions } from '../../types/options.js';
import type { ComponentFactorySource } from '../../types/source.js';

/**
 * Convert icon content to a string literal
 */
export function stringifyFactoryIconContent(
	icon: ComponentFactorySource,
	options: Pick<ComponentFactoryRenderingOptions, 'cssMode' | 'mergeCSS'>
): string {
	const { cssMode, mergeCSS } = options;

	let content = '`' + icon.content.replace(/`/g, '\\`') + '`';
	switch (cssMode) {
		case 'import':
			return content;

		case 'module': {
			// Replace all class names
			for (const className in icon.classes) {
				content = content.replace(
					// Allowed characters before and after  class name: [ "]
					new RegExp('([" ])(' + className + ')([" ])', 'g'),
					`$1\${${
						mergeCSS
							? 'css'
							: generateCSSDefaultImportName(className)
					}['${className}']}$3`
				);
			}
			return content;
		}
	}
}
