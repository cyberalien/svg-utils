import { generateCSSFilesForComponent } from '../../src/components/helpers/css/generate.js';
import { createFactoryImports } from '../../src/components/helpers/imports/create.js';
import { componentFactoryFileSystemOptions } from '../../src/components/prepare/options.js';
import type { GeneratedAssetFile } from '../../src/components/types/component.js';

describe('Generating CSS for component factory', () => {
	it('Simple CSS', () => {
		const assets: GeneratedAssetFile[] = [];
		const imports = createFactoryImports();
		generateCSSFilesForComponent(
			{
				content: '<path class="test1" />',
				classes: {
					test1: {
						fill: 'red',
						d: 'path("M10 10H20V20H10Z")',
					},
				},
			},
			imports,
			assets,
			{
				...componentFactoryFileSystemOptions({
					doubleDirsForComponents: false,
					prefixDirsForComponents: false,
					doubleDirsForCSS: false,
				}),
				cssMode: 'import',
			}
		);
		expect(assets).toHaveLength(1);
		expect(assets[0]).toEqual({
			content:
				'.test1 {\n  fill: red;\n  d: path("M10 10H20V20H10Z");\n}\n',
			import: './css/test1.css',
			filename: 'css/test1.css',
		});
		expect(imports.css).toEqual(new Set(['./css/test1.css']));
		expect(imports.modules).toEqual(Object.create(null));
	});

	it('Module', () => {
		const assets: GeneratedAssetFile[] = [];
		const imports = createFactoryImports();
		generateCSSFilesForComponent(
			{
				content: '<path class="test1" />',
				classes: {
					test1: {
						fill: 'red',
						d: 'path("M10 10H20V20H10Z")',
					},
				},
			},
			imports,
			assets,
			{
				...componentFactoryFileSystemOptions({
					doubleDirsForComponents: true,
					prefixDirsForComponents: true,
					doubleDirsForCSS: true,
				}),
				cssMode: 'module',
			}
		);
		expect(assets).toHaveLength(1);
		expect(assets[0]).toEqual({
			content:
				'.test1 {\n  fill: red;\n  d: path("M10 10H20V20H10Z");\n}\n',
			import: '../../css/t/test1.module.css',
			filename: 'css/t/test1.module.css',
		});
		expect(imports.css).toEqual(new Set());
		expect(imports.modules).toEqual({
			'../../css/t/test1.module.css': 'cssTest1',
		});
	});

	it('File', () => {
		const assets: GeneratedAssetFile[] = [];
		const imports = createFactoryImports();
		const baseOptions = componentFactoryFileSystemOptions({
			doubleDirsForComponents: false,
			prefixDirsForComponents: true,
			doubleDirsForCSS: false,
		});

		const result = generateCSSFilesForComponent(
			{
				content: '<path class="test1" />',
				classes: {
					test1: {
						fill: 'red',
						d: 'path("M10 10H20V20H10Z")',
					},
				},
			},
			imports,
			assets,
			{
				...baseOptions,
				cssMode: 'file',
			}
		);
		expect(assets).toHaveLength(0);
		expect(result).toBe(
			'.test1 {\n  fill: red;\n  d: path("M10 10H20V20H10Z");\n}\n'
		);
		expect(imports.css).toEqual(new Set());
		expect(imports.modules).toEqual(Object.create(null));
	});
});
