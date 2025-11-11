import { compareKeys } from '../../src/helpers/misc/keys.js';

describe('Testing keys comparison', () => {
	it('Strings', () => {
		expect(compareKeys('foo', 'bar')).toBe(false);
		expect(compareKeys('test1', 'test1')).toBe(true);
	});

	it('Objects and functions', () => {
		const callback1 = () => {};
		const callback2 = () => {};
		const obj1 = {};
		const obj2 = {};

		// Simple objects
		expect(
			compareKeys(
				{
					foo: 1,
					bar: 'test',
					baz: true,
				},
				{
					foo: 1,
					bar: 'test',
					baz: true,
				}
			)
		).toBe(true);

		// Extra/missing key
		expect(
			compareKeys(
				{
					foo: 1,
					bar: 'test',
					baz: 1,
				},
				{
					foo: 1,
					bar: 'test',
				}
			)
		).toBe(false);
		expect(
			compareKeys(
				{
					foo: 1,
					bar: 'test',
				},
				{
					foo: 1,
					bar: 'test',
					baz: 1,
				}
			)
		).toBe(false);

		// Callbacks and objects
		expect(
			compareKeys(
				{
					callback1,
					callback2,
					obj1,
					obj2,
					obj3: null,
				},
				{
					callback1,
					callback2,
					obj1,
					obj2,
					obj3: null,
				}
			)
		).toBe(true);
	});
});
