import type { FactoryComponentProps } from './types.js';
import { stringifyFactoryProps } from './stringify.js';

/**
 * Stringify properties for component as JS object
 */
export function stringifyFactoryPropsAsJSON(
	props: FactoryComponentProps,
	separator = '\n\t'
): string {
	return stringifyFactoryProps(
		props,
		'"{prop}": {value},',
		'"{prop}": "{value}",',
		separator
	);
}
