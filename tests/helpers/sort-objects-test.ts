import { sortObject } from '../../src/helpers/misc/sort-object.js';
import { compareValues } from '../../src/helpers/misc/compare.js';

describe('Testing sortObject', () => {
	test('Simple values', () => {
		expect(sortObject('test')).toBe('test');
		expect(sortObject(1)).toBe(1);
		expect(sortObject(true)).toBe(true);
		expect(sortObject(null)).toBe(null);
		expect(sortObject(undefined)).toBe(undefined);
	});

	test('Simple objects', () => {
		const obj1 = {
			foo: 1,
			bar: 2,
		};
		const obj2 = {
			bar: 2,
			foo: 1,
		};

		// Should not be equal without sorting
		expect(JSON.stringify(obj1)).not.toBe(JSON.stringify(obj2));

		// Sort should not affect the original object
		expect(sortObject(obj1)).toEqual(obj1);
		expect(sortObject(obj2)).toEqual(obj2);

		// Sort results
		expect(sortObject(obj1)).toEqual(sortObject(obj2));
		expect(JSON.stringify(sortObject(obj1))).toBe(
			JSON.stringify(sortObject(obj2))
		);

		// Should be identical
		expect(compareValues(obj1, obj2)).toBe(true);
	});

	test('Complex objects', () => {
		const obj1 = {
			arr: [
				1,
				9,
				5,
				{
					foo: [1, 9, 5],
					foo2: 'test',
					foo3: 7,
					bar: 2,
				},
			],
		};
		const obj2 = {
			arr: [
				1,
				9,
				5,
				{
					bar: 2,
					foo3: 7,
					foo2: 'test',
					foo: [1, 9, 5],
				},
			],
		};

		const obj3 = {
			arr: [
				1,
				9,
				5,
				{
					bar: 2,
					foo3: 7,
					foo2: 'test',
					// Different order
					foo: [1, 5, 9],
				},
			],
		};
		const obj4 = {
			arr: [
				1,
				9,
				5,
				{
					bar: 2,
					foo3: 7,
					foo2: 'test',
					// Missing 'foo'
				},
			],
		};

		// Should not be equal without sorting
		expect(JSON.stringify(obj1)).not.toBe(JSON.stringify(obj2));

		// Sort should not affect the original object
		expect(sortObject(obj1)).toEqual(obj1);
		expect(sortObject(obj2)).toEqual(obj2);

		// Sort results
		expect(sortObject(obj1)).toEqual(sortObject(obj2));
		expect(JSON.stringify(sortObject(obj1))).toBe(
			JSON.stringify(sortObject(obj2))
		);

		// Should be identical
		expect(compareValues(obj1, obj2)).toBe(true);

		// Test variations
		expect(sortObject(obj3)).not.toEqual(sortObject(obj2));
		expect(compareValues(obj1, obj3)).toBe(false);

		expect(sortObject(obj4)).not.toEqual(sortObject(obj2));
		expect(compareValues(obj1, obj4)).toBe(false);
	});
});
