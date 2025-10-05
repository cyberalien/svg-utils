import { getUniqueHash } from '../../src/helpers/hash/unique.js';

describe('Testing hashing', () => {
	test('Make sure data is hashed correctly', () => {
		// String
		expect(getUniqueHash('test', { css: true, length: 8 })).toBe(
			getUniqueHash('test', { css: true, length: 8 })
		);

		// String with and without prefix (different hash)
		expect(
			getUniqueHash('test', { css: true, length: 8, prefix: 'a' })
		).not.toBe(getUniqueHash('test', { css: true, length: 8, prefix: '' }));

		// Different character sets
		expect(
			getUniqueHash('test', { css: true, length: 8, prefix: '' })
		).not.toBe(
			getUniqueHash('test', { css: false, length: 8, prefix: '' })
		);

		// Object, different order of props
		expect(
			getUniqueHash(
				{
					foo: 1,
					bar: 2,
				},
				{ css: true, length: 8 }
			)
		).toBe(
			getUniqueHash(
				{
					bar: 2,
					foo: 1,
				},
				{ css: true, length: 8 }
			)
		);

		// Array, different order of items
		expect(
			getUniqueHash(
				{
					foo: 1,
					bar: [2, 3, 4],
				},
				{ css: true, length: 8 }
			)
		).not.toBe(
			getUniqueHash(
				{
					bar: [2, 4, 3],
					foo: 1,
				},
				{ css: true, length: 8 }
			)
		);
	});
});
