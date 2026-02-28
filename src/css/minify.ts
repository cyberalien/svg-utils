export function minifyCSS(value: string): string {
	return (
		value
			.replace(/\s+/g, ' ') // Multiple spaces to single space
			.replace(/\s*([;:{}])\s*/g, '$1') // Spaces around few characters
			.replace(/;}/g, '}') // Unnecessary semicolon before }
			// .replace(/;$/g, '') // Trailing semicolon - do not remove to make it easy to merge rules and animations
			.trim()
	);
}
