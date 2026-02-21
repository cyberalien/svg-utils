import { stringifySelectorParts } from './part/stringify.js';
import type { StateSelectorData } from './types.js';

// Join sequence of selectors into a single string
// ['.foo', '.bar'] => '.foo .bar'
function joinSequence(parts: string[]): string {
	let selectors: string[] = [];
	for (const part of parts) {
		const chunks = part.split(',').map((s) => s.trim());
		if (!selectors.length) {
			selectors.push(...chunks);
			continue;
		}

		const newSelectors: string[] = [];
		for (const chunk of chunks) {
			// Add chunk to selectors
			for (const selector of selectors) {
				newSelectors.push(`${selector} ${chunk}`);
			}
		}

		selectors = newSelectors;
	}

	const uniqueSelectors = new Set(selectors);
	return Array.from(uniqueSelectors)
		.sort((a, b) => a.localeCompare(b))
		.join(', ');
}

// Merge rules in one rule
// ['.foo, .bar', '.baz'] => '.foo, .bar, .baz'
function mergeRules(rules: string[]): string {
	const results = new Set<string>();
	for (const rule of rules) {
		const chunks = rule.split(',').map((s) => s.trim());
		for (const chunk of chunks) {
			results.add(chunk);
		}
	}
	return Array.from(results)
		.sort((a, b) => a.localeCompare(b))
		.join(', ');
}

// Merge sequences in one sequence
// ['.foo', '.bar'] + ['.baz'] => ['.foo .bar, .baz']
function mergeSequences(list1: string[], list2: string[]): string[] {
	// Find closest matching parts
	const max1 = list1.length - 1;
	const max2 = list2.length - 1;

	let match1 = -1;
	let match2 = -1;
	for (let i = 0; i <= max1; i++) {
		const part1 = list1[i];
		for (let j = 0; j <= max2; j++) {
			const part2 = list2[j];
			if (part1 === part2) {
				// Matching part
				// If match is at start/end, it should be at start/end of other list as well
				if ((i === 0 || j === 0) && i !== j) {
					continue;
				}
				if ((i === max1 || j === max2) && (i !== max1 || j !== max2)) {
					continue;
				}

				match1 = i;
				match2 = j;
				break;
			}
		}
		if (match1 !== -1) {
			break;
		}
	}

	// Check for matches
	if (match1 === -1) {
		// No matches, cannot merge
		const merged1 = joinSequence(list1);
		const merged2 = joinSequence(list2);
		return [mergeRules([merged1, merged2])];
	}

	const merged: string[] = [];
	if (match1 > 0) {
		// Merge sequences before match
		merged.push(
			mergeRules([
				joinSequence(list1.slice(0, match1)),
				joinSequence(list2.slice(0, match2)),
			])
		);
	}
	// Add matching part
	merged.push(mergeRules([list1[match1], list2[match2]]));
	// Add sequences after match, optimised if possible
	if (match1 < max1) {
		merged.push(
			...mergeSequences(list1.slice(match1 + 1), list2.slice(match2 + 1))
		);
	}
	return merged;
}

// Optimise sets by merging sets with identical at rules
function optimiseMerge(data: string[][]): string[][] {
	const result: string[][] = [];

	// Map of all sequences with identical at rules
	const atRules = new Map<string, number>();

	const add = (sequence: string[]): boolean => {
		// Get all at rules
		const atData: string[] = [];
		let skipped = false;
		for (let i = 0; i < sequence.length; i++) {
			const part = sequence[i];
			if (part.includes('@')) {
				if (skipped) {
					return false;
				}
				atData.push(`${i}:${part}`);
			} else {
				skipped = true;
			}
		}
		const atKey = atData.join('|');
		if (!skipped) {
			// At rules only: cannot merge
			result.push(sequence);
			return true;
		}

		if (atRules.has(atKey)) {
			// Merge with existing sequence
			const index = atRules.get(atKey)!;
			const existing = result[index];
			const merged: string[] = [];
			const minLength = Math.min(existing.length, sequence.length);
			for (let i = 0; i < minLength; i++) {
				const part1 = existing[i];
				const part2 = sequence[i];
				if (part1 === part2) {
					// At rule or matching part, keep as is
					merged.push(part1);
					continue;
				}

				if (part1.includes('@') || part2.includes('@')) {
					// Should not happen!
					return false;
				}

				// Merge the rest
				merged.push(
					...mergeSequences(existing.slice(i), sequence.slice(i))
				);
				break;
			}
			result[index] = merged;
			return true;
		}

		// Add new sequence
		atRules.set(atKey, result.length);
		result.push(sequence);
		return true;
	};

	for (const sequence of data) {
		if (!add(sequence)) {
			// Failed
			return data;
		}
	}
	return result;
}

// Optimise set of sequences
// Calls itself recursively until no more optimisations are possible
function optimise(data: string[][]): string[][] {
	let changed = false;
	const result: string[][] = [];

	const add = (sequence: string[]) => {
		if (!result.length) {
			result.push([...sequence]);
			return;
		}

		// Find matching sequence in result with same length
		const length = sequence.length;
		for (let i = 0; i < result.length; i++) {
			const existing = result[i];
			if (existing.length === length) {
				// Check if sequences match
				let matches = 0;
				let differentIndex = -1;
				for (let j = 0; j < length; j++) {
					if (existing[j] === sequence[j]) {
						matches++;
					} else {
						differentIndex = j;
					}
				}
				if (matches === length) {
					// Sequences match, no need to add
					return;
				}
				if (matches === length - 1) {
					// One different part
					const part1 = sequence[differentIndex];
					const part2 = existing[differentIndex];
					if (!part1.includes('@') && !part2.includes('@')) {
						// Not a pseudo-class, can merge
						existing[differentIndex] = mergeRules([part1, part2]);
						changed = true;
						return;
					}
				}
			}
		}

		// No match found, add new sequence
		result.push([...sequence]);
	};

	for (const sequence of data) {
		add(sequence);
	}

	if (!changed && result.length > 1) {
		return optimiseMerge(result);
	}

	return changed ? optimise(result) : result;
}

/**
 * Convert selector data to strings
 *
 * Returns sets of selector sequences
 */
export function stringifySelectorsForState(
	data: StateSelectorData
): string[][] | null {
	const sequences: string[][] = [];
	for (const group of data) {
		const sequence = stringifySelectorParts(group);
		if (!sequence) {
			return null;
		}
		sequences.push(sequence);
	}

	// Sort sequences by length to help with optimisation
	sequences.sort((a, b) => a.length - b.length);
	return optimise(sequences);
}
