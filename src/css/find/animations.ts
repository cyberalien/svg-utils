import { findCSSPropertyValues } from './prop.js';

const reservedAnimationNames = new Set([
	'none',
	'inherit',
	'initial',
	'revert',
	'revert-layer',
	'forwards',
	'infinite',
	'unset',
	'linear',
	'ease',
	'ease-in',
	'ease-out',
	'ease-in-out',
]);

/**
 * Find used animation names in content
 *
 * This function is opinionated, it is designed to find animation names in typical CSS content, but it may not cover all edge cases.
 * Assumes animation name uses only the following characters: a-z, 0-9, -, _ and starts with a letter.
 *
 * Might return false positives
 */
export function findUsedKeyframes(content: string): string[] {
	const keyframes = new Set<string>();

	// Find by animation-name property
	findCSSPropertyValues(content, 'animation-name').forEach((name) =>
		keyframes.add(name)
	);

	// Find by animation property
	findCSSPropertyValues(content, 'animation').forEach((value) => {
		value
			.split(/\s+/)
			.filter(
				(part) =>
					!reservedAnimationNames.has(part) &&
					part.match(/^[a-z]+[a-z0-9_-]*$/)
			)
			.forEach((part) => keyframes.add(part));
	});

	return Array.from(keyframes);
}
