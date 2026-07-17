import type { IconStatesList } from '../types.js';
import type { IconFallbackTemplate } from './types.js';

/**
 * Parse fallback template string into array of strings and states
 */
export function parseIconFallbackTemplate(
	fallback: string,
	states: IconStatesList
): IconFallbackTemplate | undefined {
	const chunks: IconFallbackTemplate = [];

	// Unwrap single quotes
	const unwrap = (value: string): string =>
		value.startsWith("'") && value.endsWith("'") ? value.slice(1, -1) : value;

	let startIndex = 0;
	for (const match of fallback.matchAll(/{[^}]+}/g)) {
		const matchText = match[0];

		// Add string before match
		const matchIndex = match.index || 0;
		if (matchIndex > startIndex) {
			const prev = fallback.slice(startIndex, matchIndex);
			if (prev) {
				chunks.push(prev);
			}
		}
		startIndex = matchIndex + matchText.length;

		// Split match
		// Text matches are parts of text
		// Separators are '{', everyhing in middle and '}'
		// Indexes of text and separator before that text are the same
		// Text can contain single quotes, used for empty values
		const textMatches = Array.from(matchText.matchAll(/[a-z0-9:'-]+/g));
		if (!textMatches.length) {
			// throw new Error(
			// 	`Invalid fallback state: ${fallback} (no text matches)`
			// );
			return;
		}
		const separators = Array.from(matchText.matchAll(/[^a-z0-9:'-]/g));
		if (separators.length !== textMatches.length + 1) {
			// throw new Error(
			// 	`Invalid fallback state: ${fallback} (separators.length = ${separators.length}, textMatches.length = ${textMatches.length})`
			// );
			return;
		}

		// Get state name, find state
		const stateName = textMatches[0][0].trim();
		const state = states.find((s) =>
			typeof s === 'string' ? s === stateName : s[0] === stateName
		);
		if (!state) {
			// throw new Error(
			// 	`Invalid fallback state: ${fallback} (state "${stateName}" not found)`
			// );
			return;
		}

		// Check state type
		if (typeof state === 'string') {
			// Parse boolean state
			// Expected formats:
			//  {state?true-value|false-value}
			//  {state?true-value|''}
			//  {state?''|false-value}
			//  {state}
			const isShortcut = textMatches.length === 1;
			if (!isShortcut && textMatches.length !== 3) {
				// throw new Error(
				// 	`Invalid fallback state: ${fallback} (error parsing boolean state "${stateName}", found ${textMatches.length} text matches)`
				// );
				return;
			}
			const trueValue = isShortcut ? state : textMatches[1][0];
			const falseValue = isShortcut ? '' : textMatches[2][0];

			// Validate separators
			if (!isShortcut) {
				const firstSeparator = separators[1][0];
				const secondSeparator = separators[2][0];
				if (firstSeparator !== '?' || secondSeparator !== '|') {
					// throw new Error(
					// 	`Invalid fallback state: ${fallback} (error parsing boolean state "${stateName}", invalid separators)`
					// );
					return;
				}
			}
			chunks.push({
				state,
				values: [unwrap(falseValue), unwrap(trueValue)],
			});
		} else {
			// Parse advanced state
			// Parse named state
			// Expected formats:
			//  {state}
			if (textMatches.length > 1) {
				// throw new Error(
				// 	`Invalid fallback state: ${fallback} (error parsing named state "${stateName}", too many text matches)`
				// );
				return;
			}
			chunks.push({
				state: stateName,
			});
		}
	}

	// Add remaining string after last match
	if (startIndex < fallback.length) {
		chunks.push(fallback.slice(startIndex));
	}

	return chunks;
}
