/**
 * Find all values of a CSS property in content
 */
export function findCSSPropertyValues(
	content: string,
	property: string
): string[] {
	const values: string[] = [];
	content
		.matchAll(new RegExp(`${property}\\s*:\\s*([^;]+);`, 'g'))
		.forEach((match) => {
			values.push(...match[1].split(',').map((part) => part.trim()));
		});
	return values;
}
