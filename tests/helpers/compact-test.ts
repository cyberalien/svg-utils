import {
	compactItem,
	createCompactContext,
} from '../../src/helpers/data/compact.js';
import { expandItem } from '../../src/helpers/data/expand.js';

describe('Compact data', () => {
	test('Compact and expand items', () => {
		const context = createCompactContext<string>();
		const items: Record<string, string | number>[] = [
			{
				foo: 'test 1',
				bar: 'test 2',
				baz: 'test 3',
			},
			{
				foo: 'test 1',
				bar: 'test 3',
			},
			{
				foo: 'test 4',
				bar: 'test 2',
			},
		];
		for (const item of items) {
			for (const key in item) {
				compactItem(context, item[key] as string, item, key);
			}
		}
		expect(context.data).toEqual(['test 1', 'test 3', 'test 2']);
		expect(items).toEqual([
			{ foo: 0, bar: 2, baz: 1 },
			{ foo: 0, bar: 1 },
			{ foo: 'test 4', bar: 2 },
		]);

		// Expand items
		for (const item of items) {
			for (const key in item) {
				expandItem(context.data, item, key);
			}
		}
		expect(items).toEqual([
			{
				foo: 'test 1',
				bar: 'test 2',
				baz: 'test 3',
			},
			{
				foo: 'test 1',
				bar: 'test 3',
			},
			{
				foo: 'test 4',
				bar: 'test 2',
			},
		]);
	});
});
