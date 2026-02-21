import {
	mergeArrays,
	mergeMultipleArrays,
} from '../../src/svg-css/states/selector/helpers/iterate.js';

describe('Testing array helper functions', () => {
	test('Test mergeArrays function', () => {
		// Nothing to merge
		expect(mergeArrays(['a', 'b'], [], (a, b) => `${a}${b}`)).toEqual([
			['a', 'b'],
		]);
		expect(mergeArrays([], ['a', 'b'], (a, b) => `${a}${b}`)).toEqual([
			['a', 'b'],
		]);

		// Add one item
		expect(mergeArrays(['a', 'b'], ['c'], (a, b) => `${a}${b}`)).toEqual([
			['c', 'a', 'b'],
			['ac', 'b'],
			['a', 'c', 'b'],
			['a', 'bc'],
			['a', 'b', 'c'],
		]);

		// Add one item without merge
		expect(mergeArrays(['a', 'b'], ['c'], () => null)).toEqual([
			['c', 'a', 'b'],
			['a', 'c', 'b'],
			['a', 'b', 'c'],
		]);

		// Add two items to one item
		expect(mergeArrays(['c'], ['a', 'b'], (a, b) => `${b}${a}`)).toEqual([
			['a', 'b', 'c'],
			['a', 'bc'],
			['a', 'c', 'b'],
			['ac', 'b'],
			['c', 'a', 'b'],
		]);
		expect(mergeArrays(['c'], ['a', 'b'], () => null)).toEqual([
			['a', 'b', 'c'],
			['a', 'c', 'b'],
			['c', 'a', 'b'],
		]);

		// Two items in each list
		expect(
			mergeArrays(['a', 'b'], ['c', 'd'], (a, b) => `${a}${b}`)
		).toEqual([
			['c', 'd', 'a', 'b'],
			['c', 'ad', 'b'],
			['c', 'a', 'd', 'b'],
			['c', 'a', 'bd'],
			['c', 'a', 'b', 'd'],
			['ac', 'd', 'b'],
			['ac', 'bd'],
			['ac', 'b', 'd'],
			['a', 'c', 'd', 'b'],
			['a', 'c', 'bd'],
			['a', 'c', 'b', 'd'],
			['a', 'bc', 'd'],
			['a', 'b', 'c', 'd'],
		]);
		expect(mergeArrays(['a', 'b'], ['c', 'd'], () => null)).toEqual([
			['c', 'd', 'a', 'b'],
			['c', 'a', 'd', 'b'],
			['c', 'a', 'b', 'd'],
			['a', 'c', 'd', 'b'],
			['a', 'c', 'b', 'd'],
			['a', 'b', 'c', 'd'],
		]);
	});

	test('Test mergeMultipleArrays function', () => {
		// Nothing to merge
		expect(mergeMultipleArrays([], (a, b) => `${a}${b}`)).toEqual([]);
		expect(mergeMultipleArrays([['a', 'b']], (a, b) => `${a}${b}`)).toEqual(
			[['a', 'b']]
		);
		expect(
			mergeMultipleArrays([['a', 'b'], [], []], (a, b) => `${a}${b}`)
		).toEqual([['a', 'b']]);

		// Two arrays
		expect(
			mergeMultipleArrays(
				[
					['a', 'b'],
					['c', 'd'],
				],
				(a, b) => `${a}${b}`
			)
		).toEqual(mergeArrays(['a', 'b'], ['c', 'd'], (a, b) => `${a}${b}`));

		// 3 arrays
		expect(
			mergeMultipleArrays([['a'], ['b'], ['c']], (a, b) => `${a}${b}`)
		).toEqual([
			['c', 'b', 'a'],
			['bc', 'a'],
			['b', 'c', 'a'],
			['b', 'ac'],
			['b', 'a', 'c'],
			['c', 'ab'],
			['abc'],
			['ab', 'c'],
			['c', 'a', 'b'],
			['ac', 'b'],
			['a', 'c', 'b'],
			['a', 'bc'],
			['a', 'b', 'c'],
		]);
	});
});
