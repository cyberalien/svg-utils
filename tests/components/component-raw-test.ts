import { convertIconifyIconToFactoryContent } from '../../src/components/prepare/iconify.js';
import { createRawComponent } from '../../src/components/raw.js';
import { componentFactoryFileSystemOptions } from '../../src/components/prepare/options.js';
import type { FactoryIconData } from '../../src/components/types/data.js';
import { createUniqueHashContext } from '../../src/helpers/hash/context.js';

describe('Creating raw components', () => {
	it('Simple icon', () => {
		const context = createUniqueHashContext();
		const options = componentFactoryFileSystemOptions({});
		const data: FactoryIconData = {
			prefix: 'test',
			name: 'icon',
			viewBox: {
				width: 24,
				height: 24,
			},
			icon: {
				content:
					'<path d="M0 0l24 24" stroke="currentColor" fill="none" />',
			},
		};
		const result = createRawComponent(data, {
			context,
			...options,
			cssMode: 'import',
		});
		expect(result.content).toBe(
			'const icon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0l24 24" stroke="currentColor" fill="none" /></svg>`;\n\nexport default icon;\n'
		);
		expect(result.assets).toHaveLength(1);
		expect(result.assets[0].filename).toBe('i/icon.d.ts');
		expect(result.style).toBeUndefined();
	});

	it('Icon with CSS', () => {
		const context = createUniqueHashContext();
		const options = componentFactoryFileSystemOptions({
			doubleDirsForCSS: false,
			doubleDirsForComponents: false,
		});

		// Convert IconifyIcon and test it
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
		expect(data.viewBox).toEqual({
			left: 0,
			top: 0,
			width: 16,
			height: 16,
		});

		// Fallback should be set, but will be ignored
		expect(data.fallback).toEqual('test-prefix:line-icon');

		// Get class name
		const classNames = Object.keys(data.icon.classes ?? {});
		expect(classNames).toHaveLength(1);
		const testClassName = classNames[0];

		// Generate component
		const result = createRawComponent(data, {
			context,
			...options,
			cssMode: 'import',
			height: '1em',
		});
		expect(result.content).toBe(
			`import './css/${testClassName}.css';\n\n` +
				'const icon = `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16"><path class="' +
				testClassName +
				'"/></svg>`;\n\nexport default icon;\n'
		);
		expect(result.assets).toHaveLength(2);
		expect(result.assets[0].filename).toBe(`css/${testClassName}.css`);
		expect(result.assets[1].filename).toBe('line-icon.d.ts');
		expect(result.style).toBeUndefined();
	});

	it('Icon with CSS', () => {
		const context = createUniqueHashContext();
		const options = componentFactoryFileSystemOptions({
			doubleDirsForCSS: false,
			doubleDirsForComponents: false,
		});

		// Convert IconifyIcon and test it
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
		expect(data.viewBox).toEqual({
			left: 0,
			top: 0,
			width: 16,
			height: 16,
		});

		// Fallback should be set, but will be ignored
		expect(data.fallback).toEqual('test-prefix:line-icon');

		// Get class name
		const classNames = Object.keys(data.icon.classes ?? {});
		expect(classNames).toHaveLength(1);
		const testClassName = classNames[0];

		// Generate component
		const result = createRawComponent(data, {
			context,
			...options,
			cssMode: 'import',
			height: '1em',
		});
		expect(result.content).toBe(
			`import './css/${testClassName}.css';\n\n` +
				'const icon = `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16"><path class="' +
				testClassName +
				'"/></svg>`;\n\nexport default icon;\n'
		);
		expect(result.assets).toHaveLength(2);
		expect(result.assets[0].filename).toBe(`css/${testClassName}.css`);
		expect(result.assets[1].filename).toBe('line-icon.d.ts');
		expect(result.style).toBeUndefined();
	});

	it('Icon with CSS, separate file', () => {
		const context = createUniqueHashContext();
		const options = componentFactoryFileSystemOptions({
			doubleDirsForCSS: false,
			doubleDirsForComponents: false,
		});

		// Convert IconifyIcon and test it
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
		expect(data.viewBox).toEqual({
			left: 0,
			top: 0,
			width: 16,
			height: 16,
		});

		// Fallback should be set, but will be ignored
		expect(data.fallback).toEqual('test-prefix:line-icon');

		// Get class name
		const classNames = Object.keys(data.icon.classes ?? {});
		expect(classNames).toHaveLength(1);
		const testClassName = classNames[0];

		// Generate component
		const result = createRawComponent(data, {
			context,
			...options,
			cssMode: 'prop',
		});
		expect(result.content).toBe(
			'const icon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path class="' +
				testClassName +
				'"/></svg>`;\n\nexport default icon;\n'
		);
		expect(result.assets).toHaveLength(1);
		expect(result.assets[0].filename).toBe('line-icon.d.ts');
		expect(result.style).toBe(
			`.${testClassName} {\n  d: path("M0 0l16 16");\n  fill: currentColor;\n}\n`
		);
	});

	it('Icon with CSS, embedded', () => {
		const context = createUniqueHashContext();
		const options = componentFactoryFileSystemOptions({
			doubleDirsForCSS: false,
			doubleDirsForComponents: false,
		});

		// Convert IconifyIcon and test it
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
		expect(data.viewBox).toEqual({
			left: 0,
			top: 0,
			width: 16,
			height: 16,
		});

		// Fallback should be set, but will be ignored
		expect(data.fallback).toEqual('test-prefix:line-icon');

		// Get class name
		const classNames = Object.keys(data.icon.classes ?? {});
		expect(classNames).toHaveLength(1);
		const testClassName = classNames[0];

		// Generate component
		const result = createRawComponent(data, {
			context,
			...options,
			cssMode: 'embed',
		});
		expect(result.content).toBe(
			'const icon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><style>.' +
				testClassName +
				' {\n  d: path("M0 0l16 16");\n  fill: currentColor;\n}\n</style><path class="' +
				testClassName +
				'"/></svg>`;\n\nexport default icon;\n'
		);
		expect(result.assets).toHaveLength(1);
		expect(result.assets[0].filename).toBe('line-icon.d.ts');
		expect(result.style).toBeUndefined();
	});
});
