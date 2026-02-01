import { getUniqueHash } from '../../src/helpers/hash/unique.js';
import { createUniqueHashContext } from '../../src/helpers/hash/context.js';

describe('Testing hashing', () => {
	test('Make sure data is hashed correctly', () => {
		const context = createUniqueHashContext();

		// String
		expect(getUniqueHash('test', { css: true, length: 8, context })).toBe(
			getUniqueHash('test', { css: true, length: 8, context })
		);

		// String with and without prefix (different hash)
		expect(
			getUniqueHash('test', {
				css: true,
				length: 8,
				prefix: 'a',
				context,
			})
		).not.toBe(
			getUniqueHash('test', { css: true, length: 8, prefix: '', context })
		);

		// Different character sets
		expect(
			getUniqueHash('test', { css: true, length: 8, prefix: '', context })
		).not.toBe(
			getUniqueHash('test', {
				css: false,
				length: 8,
				prefix: '',
				context,
			})
		);

		// Object, different order of props
		expect(
			getUniqueHash(
				{
					foo: 1,
					bar: 2,
				},
				{ css: true, length: 8, context }
			)
		).toBe(
			getUniqueHash(
				{
					bar: 2,
					foo: 1,
				},
				{ css: true, length: 8, context }
			)
		);

		// Array, different order of items
		expect(
			getUniqueHash(
				{
					foo: 1,
					bar: [2, 3, 4],
				},
				{ css: true, length: 8, context }
			)
		).not.toBe(
			getUniqueHash(
				{
					bar: [2, 4, 3],
					foo: 1,
				},
				{ css: true, length: 8, context }
			)
		);
	});
});
