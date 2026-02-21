import { getFactoryRelativeRootPath } from '../../src/components/helpers/filenames/path.js';
import { getGeneratedAssetFilename } from '../../src/components/helpers/filenames/asset.js';
import { getGeneratedComponentFilename } from '../../src/components/export/filename.js';
import { getGeneratedCSSFilename } from '../../src/components/helpers/filenames/css.js';
import { getGeneratedComponentTypesFilename } from '../../src/components/helpers/filenames/types.js';
import { componentFactoryFileSystemOptions } from '../../src/components/prepare/options.js';
import { createUniqueHashContext } from '../../src/helpers/hash/context.js';

describe('Generating filenames for component factory', () => {
	it('Component filename', () => {
		// No extension
		expect(
			getGeneratedComponentFilename(
				{
					prefix: 'prefix',
					name: 'icon-name',
				},
				'',
				{
					doubleDirsForComponents: false,
					prefixDirsForComponents: false,
				}
			)
		).toEqual('icon-name');

		// Extension
		expect(
			getGeneratedComponentFilename(
				{
					prefix: 'prefix',
					name: 'name',
				},
				'.vue',
				{
					doubleDirsForComponents: false,
					prefixDirsForComponents: false,
				}
			)
		).toEqual('name.vue');

		// Extra directories
		expect(
			getGeneratedComponentFilename(
				{
					prefix: 'prefix',
					name: 'name',
				},
				'.tsx',
				{
					doubleDirsForComponents: true,
					prefixDirsForComponents: true,
				}
			)
		).toEqual('prefix/n/name.tsx');

		// Custom prefix directory
		expect(
			getGeneratedComponentFilename(
				{
					prefix: 'prefix',
					name: 'name',
				},
				'.tsx',
				{
					doubleDirsForComponents: true,
					prefixDirsForComponents: 'icons',
				}
			)
		).toEqual('icons/n/name.tsx');
	});

	it('Asset filename', () => {
		expect(
			getGeneratedAssetFilename(
				'assets/viewbox/0-0-24-24.js',
				getFactoryRelativeRootPath({
					doubleDirsForComponents: false,
					prefixDirsForComponents: false,
				})
			)
		).toEqual({
			import: './assets/viewbox/0-0-24-24.js',
			filename: 'assets/viewbox/0-0-24-24.js',
		});

		// Double directories for components
		expect(
			getGeneratedAssetFilename(
				'viewbox/0-0-24-24.js',
				getFactoryRelativeRootPath({
					doubleDirsForComponents: true,
					prefixDirsForComponents: false,
				})
			)
		).toEqual({
			import: '../viewbox/0-0-24-24.js',
			filename: 'viewbox/0-0-24-24.js',
		});

		// Add prefix directory for components
		expect(
			getGeneratedAssetFilename(
				'viewbox/0-0-24-24.js',
				getFactoryRelativeRootPath({
					doubleDirsForComponents: false,
					prefixDirsForComponents: true,
				})
			)
		).toEqual({
			import: '../viewbox/0-0-24-24.js',
			filename: 'viewbox/0-0-24-24.js',
		});

		// Custom prefix directory for components
		expect(
			getGeneratedAssetFilename(
				'viewbox/0-0-24-24.js',
				getFactoryRelativeRootPath({
					doubleDirsForComponents: false,
					prefixDirsForComponents: 'foo/bar',
				})
			)
		).toEqual({
			import: '../../viewbox/0-0-24-24.js',
			filename: 'viewbox/0-0-24-24.js',
		});

		// Custom prefix for path
		expect(
			getGeneratedAssetFilename(
				'assets/viewbox/0-0-24-24.js',
				getFactoryRelativeRootPath(
					{
						doubleDirsForComponents: false,
						prefixDirsForComponents: false,
					},
					'package-root'
				)
			)
		).toEqual({
			import: './assets/viewbox/0-0-24-24.js',
			filename: 'package-root/assets/viewbox/0-0-24-24.js',
		});
	});

	it('CSS filename', () => {
		expect(
			getGeneratedCSSFilename('test1', {
				...componentFactoryFileSystemOptions({
					doubleDirsForComponents: false,
					prefixDirsForComponents: false,
				}),
				doubleDirsForCSS: false,
			})
		).toEqual({
			import: './css/test1.css',
			filename: 'css/test1.css',
		});

		// Extra directory in CSS
		expect(
			getGeneratedCSSFilename('test1', {
				...componentFactoryFileSystemOptions({
					doubleDirsForComponents: false,
					prefixDirsForComponents: false,
				}),
				doubleDirsForCSS: true,
			})
		).toEqual({
			import: './css/t/test1.css',
			filename: 'css/t/test1.css',
		});

		// Extra directories
		expect(
			getGeneratedCSSFilename('test1', {
				...componentFactoryFileSystemOptions({
					doubleDirsForComponents: true,
					prefixDirsForComponents: true,
				}),
				doubleDirsForCSS: false,
			})
		).toEqual({
			import: '../../css/test1.css',
			filename: 'css/test1.css',
		});

		// Custom path
		expect(
			getGeneratedCSSFilename('test1', {
				...componentFactoryFileSystemOptions({
					doubleDirsForComponents: true,
					prefixDirsForComponents: 'foo/bar',
				}),
				doubleDirsForCSS: false,
			})
		).toEqual({
			import: '../../../css/test1.css',
			filename: 'css/test1.css',
		});

		// Custom prefix for path
		expect(
			getGeneratedCSSFilename('test1', {
				...componentFactoryFileSystemOptions(
					{
						doubleDirsForComponents: false,
						prefixDirsForComponents: false,
					},
					'package-test'
				),
				doubleDirsForCSS: false,
			})
		).toEqual({
			import: './css/test1.css',
			filename: 'package-test/css/test1.css',
		});
	});

	it('Types filename', () => {
		const context = createUniqueHashContext();

		// Basic name
		expect(
			getGeneratedComponentTypesFilename(
				{
					prefix: 'prefix',
					name: 'icon-name',
				},
				'test',
				{
					...componentFactoryFileSystemOptions({
						doubleDirsForComponents: false,
						prefixDirsForComponents: false,
					}),
					context,
				}
			)
		).toEqual({
			import: './icon-name.d.ts',
			filename: 'icon-name.d.ts',
		});

		// Shared types
		expect(
			getGeneratedComponentTypesFilename(
				{
					prefix: 'prefix',
					name: 'icon-name',
				},
				'test',
				{
					...componentFactoryFileSystemOptions({
						doubleDirsForComponents: false,
						prefixDirsForComponents: false,
						sharedTypes: true,
					}),
					context,
				}
			)
		).toEqual({
			import: './types/gzs3j1bx.d.ts',
			filename: 'types/gzs3j1bx.d.ts',
		});

		// Nested directories
		expect(
			getGeneratedComponentTypesFilename(
				{
					prefix: 'prefix',
					name: 'icon-name',
				},
				'test',
				{
					...componentFactoryFileSystemOptions({
						doubleDirsForComponents: true,
						prefixDirsForComponents: true,
					}),
					context,
				}
			)
		).toEqual({
			import: './icon-name.d.ts',
			filename: 'prefix/i/icon-name.d.ts',
		});

		// Custom prefix directory
		expect(
			getGeneratedComponentTypesFilename(
				{
					prefix: 'prefix',
					name: 'icon-name',
				},
				'test',
				{
					...componentFactoryFileSystemOptions({
						doubleDirsForComponents: true,
						prefixDirsForComponents: 'foo/bar',
					}),
					context,
				}
			)
		).toEqual({
			import: './icon-name.d.ts',
			filename: 'foo/bar/i/icon-name.d.ts',
		});

		// Custom path prefix
		expect(
			getGeneratedComponentTypesFilename(
				{
					prefix: 'prefix',
					name: 'icon-name',
				},
				'test',
				{
					...componentFactoryFileSystemOptions(
						{
							doubleDirsForComponents: false,
							prefixDirsForComponents: false,
						},
						'package-root'
					),
					context,
				}
			)
		).toEqual({
			import: './icon-name.d.ts',
			filename: 'package-root/icon-name.d.ts',
		});
	});
});
