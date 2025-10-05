import type {
	FactoryComponentDynamicProp,
	FactoryComponentProps,
} from './types.js';

/**
 * Stringify properties for component
 */
function parse(
	props: FactoryComponentProps,
	format: (key: string, item: FactoryComponentDynamicProp) => string
): string[] {
	const result: string[] = [];
	for (const key in props) {
		const value = props[key];
		if (typeof value !== 'string' && value.type) {
			result.push(format(key, value));
		}
	}
	return result;
}

/**
 * Stringify properties for component
 */
export function stringifyFactoryPropTypes(
	props: FactoryComponentProps
): string {
	return parse(props, (key, value) => {
		return `\t${key}${value.required ? '' : '?'}: ${value.type};`;
	}).join('\n');
}

/**
 * Get used properties
 */
export function getUsedFactoryProps(props: FactoryComponentProps): string[] {
	return parse(props, (key) => key);
}
