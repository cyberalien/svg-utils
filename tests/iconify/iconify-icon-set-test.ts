import type { IconifyIcon } from '@iconify/types';
import { parseIconifyIconSet } from '../../src/iconify/icon-set/parse.js';

interface ResolvedIcon extends IconifyIcon {
	parent?: string;
}

describe('Parsing Iconify icon sets', () => {
	it('Simple icon set', () => {
		// Names list
		const names: string[] = ['icon_1', 'icon_2'];
		const parsed: string[] = [];

		// Resolved data
		const expected: Record<string, ResolvedIcon | null> = {
			icon_1: {
				body: '<path d="icon1" />',
				width: 24,
				height: 24,
			},
			icon_2: {
				body: '<path d="icon2" />',
				width: 24,
				height: 24,
			},
		};

		parseIconifyIconSet(
			{
				prefix: 'foo',
				icons: {
					icon_1: {
						body: '<path d="icon1" />',
					},
					icon_2: {
						body: '<path d="icon2" />',
					},
				},
				width: 24,
				height: 24,
			},
			(name, data) => {
				parsed.push(name);

				// Make sure name matches
				expect(names.length).toBeGreaterThanOrEqual(1);
				expect(name).toBe(names.shift());

				// Check icon data
				expect(data).toEqual(expected[name]);
			}
		);

		expect(parsed).toEqual(['icon_1', 'icon_2']);
	});

	it('Icon set with alias and missing icon', () => {
		// Names list
		const names: string[] = [
			'icon_1',
			'icon_2',
			'icon_3',
			'icon_3b',
			'bad_alias',
			'missing',
		];
		const parsed: string[] = [];

		// Resolved data
		const expected: Record<string, ResolvedIcon | null> = {
			icon_1: {
				body: '<path d="icon1" />',
				width: 20,
				height: 24,
			},
			icon_2: {
				body: '<path d="icon2" />',
				width: 24,
				height: 24,
			},
			icon_3: {
				body: '<path d="icon2" />',
				parent: 'icon_2',
				left: 2,
				width: 20,
				height: 24,
			},
			icon_3b: null,
			bad_alias: null,
			missing: null,
		};

		parseIconifyIconSet(
			{
				prefix: 'foo',
				not_found: ['missing'],
				icons: {
					icon_1: {
						body: '<path d="icon1" />',
						width: 20,
					},
					icon_2: {
						body: '<path d="icon2" />',
						width: 24,
					},
				},
				aliases: {
					icon_3: {
						parent: 'icon_2',
						left: 2,
						width: 20,
					},
					icon_3b: {
						// Ignored: this parser supports only direct parent
						parent: 'icon_3',
					},
					bad_alias: {
						// Ignored: no such icon
						parent: 'non_existent_icon',
					},
				},
				height: 24,
			},
			(name, data) => {
				parsed.push(name);

				// Make sure name matches
				expect(names.length).toBeGreaterThanOrEqual(1);
				expect(name).toBe(names.shift());

				// Check icon data
				expect(data).toEqual(expected[name]);
			}
		);

		expect(parsed).toEqual([
			'icon_1',
			'icon_2',
			'icon_3',
			'icon_3b',
			'bad_alias',
			'missing',
		]);
	});
});
