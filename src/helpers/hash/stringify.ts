// Allow only letters for the first and last characters
const firstCSSChars = 'abcdefghijklmnopqrstuvwxyz';
const firstIDChars = firstCSSChars + firstCSSChars.toUpperCase();

// Allow more characters than simple toString() to reduce the chance of collisions
const numChars = '0123456789';
const allCSSChars = firstCSSChars + numChars + '-_';
const allIDChars = firstIDChars + numChars;

/**
 * Convert hash to a string, usable in CSS for class names and keyframes
 */
export function hashToString(
	value: number[],
	css: boolean,
	hasPrefix = true,
	limit = 8
): string {
	// Get characters
	const firstChars = css ? firstCSSChars : firstIDChars;
	const chars = css ? allCSSChars : allIDChars;

	const firstLetterRadix = firstChars.length;
	const letterRadix = chars.length;

	// Parse numbers
	const result: string[] = [];

	let num = value.shift() ?? 0;
	if (!hasPrefix) {
		// Use different radix for first char
		result.push(firstChars[num % firstLetterRadix]);
		num = Math.floor(num / firstLetterRadix);
	}

	// eslint-disable-next-line no-constant-condition
	while (true) {
		while (num < 1) {
			if (!value.length) {
				return result.join('');
			}
			num = value.shift() ?? 0;
		}

		const isLastChar = result.length === limit - 1;
		result.push(
			isLastChar
				? firstChars[num % firstLetterRadix]
				: chars[num % letterRadix]
		);
		if (result.length === limit) {
			return result.join('');
		}
		num = Math.floor(num / letterRadix);
	}
}
