/**
 * Merge lines into a string with padding
 */
export function stringifyFactoryIconCodeLines(
	lines: string[],
	padding = 0
): string {
	const pad = '  '.repeat(padding);
	return lines.map((line) => pad + line).join('\n');
}
