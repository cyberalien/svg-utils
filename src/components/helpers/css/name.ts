import { camelize } from '../../../helpers/misc/strings.js';

/**
 * Generate import name for CSS module
 *
 * Should be cleaned up because dashes are not allowed
 */
export function generateCSSDefaultImportName(className: string): string {
	return camelize('css-' + className);
}
