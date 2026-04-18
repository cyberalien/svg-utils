import { convertIconifyIconToFactoryContent } from '../../src/components/prepare/iconify.js';
import { createUniqueHashContext } from '../../src/helpers/hash/context.js';

describe('Preparing Iconify icon data', () => {
	it('SVG+CSS', () => {
		const context = createUniqueHashContext();
		const data = convertIconifyIconToFactoryContent(
			{
				body: '<path d="M0 0l16 16" fill="currentColor" />',
			},
			'test-prefix',
			'line-icon',
			{ context }
		);

		expect(data.prefix).toBe('test-prefix');
		expect(data.name).toBe('line-icon');
		expect(data.icon.viewBox).toEqual({
			left: 0,
			top: 0,
			width: 16,
			height: 16,
		});

		// Fallback should be set
		expect(data.icon.defaultFallback).toEqual('test-prefix:line-icon');

		// Get class name
		const classNames = Object.keys(data.icon.classes ?? {});
		expect(classNames).toHaveLength(1);
		const testClassName = classNames[0];
		expect(data.icon.classes).toEqual({
			[testClassName]: {
				d: 'path("M0 0l16 16")',
				fill: 'currentColor',
			},
		});
	});

	it('SVG+CSS, no fallback', () => {
		const context = createUniqueHashContext();
		const data = convertIconifyIconToFactoryContent(
			{
				body: '<path d="M0 0l16 16" fill="currentColor" />',
			},
			'test-prefix',
			'line-icon',
			{ context, fallback: false }
		);

		expect(data.prefix).toBe('test-prefix');
		expect(data.name).toBe('line-icon');

		// Fallback should not be set
		expect(data.icon.defaultFallback).toBeUndefined();

		// Get class name
		const classNames = Object.keys(data.icon.classes ?? {});
		expect(classNames).toHaveLength(1);
		const testClassName = classNames[0];
		expect(data.icon.classes).toEqual({
			[testClassName]: {
				d: 'path("M0 0l16 16")',
				fill: 'currentColor',
			},
		});
	});

	it('SVG+CSS, custom fallback', () => {
		const context = createUniqueHashContext();
		const data = convertIconifyIconToFactoryContent(
			{
				body: '<path d="M0 0l16 16" fill="currentColor" />',
			},
			'test-prefix',
			'line-icon',
			{ context, fallback: 'foo:bar' }
		);

		expect(data.prefix).toBe('test-prefix');
		expect(data.name).toBe('line-icon');

		// Fallback should be set
		expect(data.icon.defaultFallback).toEqual('foo:bar');

		// Get class name
		const classNames = Object.keys(data.icon.classes ?? {});
		expect(classNames).toHaveLength(1);
		const testClassName = classNames[0];
		expect(data.icon.classes).toEqual({
			[testClassName]: {
				d: 'path("M0 0l16 16")',
				fill: 'currentColor',
			},
		});
	});

	it('SVG+CSS, legacy mode', () => {
		const context = createUniqueHashContext();
		const data = convertIconifyIconToFactoryContent(
			{
				body: '<path d="M0 0l16 16" fill="currentColor" />',
			},
			'test-prefix',
			'line-icon',
			{ context, legacy: true }
		);

		expect(data.prefix).toBe('test-prefix');
		expect(data.name).toBe('line-icon');

		// Fallback is not needed in legacy mode
		expect(data.icon.defaultFallback).toBeUndefined();

		// Get class name
		const classNames = Object.keys(data.icon.classes ?? {});
		expect(classNames).toHaveLength(1);
		const testClassName = classNames[0];
		expect(data.icon.classes).toEqual({
			[testClassName]: {
				fill: 'currentColor',
			},
		});
	});

	it('Raw mode', () => {
		const context = createUniqueHashContext();
		const data = convertIconifyIconToFactoryContent(
			{
				body: '<path d="M0 0l16 16" fill="currentColor" />',
			},
			'test-prefix',
			'line-icon',
			{ context, raw: true }
		);

		expect(data.prefix).toBe('test-prefix');
		expect(data.name).toBe('line-icon');

		// Fallback is not needed in raw mode
		expect(data.icon.defaultFallback).toBeUndefined();

		// Get class name
		const classNames = Object.keys(data.icon.classes ?? {});
		expect(classNames).toHaveLength(0);
	});
});
