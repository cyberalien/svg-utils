/**
 * Stringify properties
 */
export function stringifyProps(props: Record<string, string>): string {
	return Object.entries(props)
		.map(([key, value]) => `${key}="${value}"`)
		.join(' ');
}
