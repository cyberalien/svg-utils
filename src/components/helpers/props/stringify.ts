import type { FactoryComponentProps } from './types.js';

/**
 * Template for property
 */
export const factoryPropTemplate = '{prop}="{value}"';

/**
 * Stringify properties for component
 */
export function stringifyFactoryProps(
	props: FactoryComponentProps,
	dynamicTemplate: string,
	staticTemplate = factoryPropTemplate,
	separator = ' '
): string {
	const result: string[] = [];
	for (const key in props) {
		const value = props[key];
		const actualValue = typeof value === 'string' ? value : value.value;
		if (actualValue !== undefined) {
			const template =
				typeof value === 'string'
					? staticTemplate
					: value.template ?? dynamicTemplate;
			if (template) {
				result.push(
					template
						.replace('{prop}', key)
						.replace('{value}', actualValue)
				);
			}
		}
	}
	return result.join(separator);
}
