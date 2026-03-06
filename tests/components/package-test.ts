import { rm } from 'node:fs/promises';
import type { IconifyJSON } from '@iconify/types';
import { componentFactoryFileSystemOptions } from '../../src/components/prepare/options.js';
import type {
	FactoryComponent,
	FactoryGeneratedComponent,
} from '../../src/components/types/component.js';
import { parseIconifyIconSet } from '../../src/iconify/icon-set/parse.js';
import {
	convertIconifyIconToFactoryContent,
	getIconifyIconsetMetadataAsset,
} from '../../src/components/prepare/iconify.js';
import { convertGeneratedComponentToFile } from '../../src/components/export/file.js';
import { mergeExportedComponentFiles } from '../../src/components/export/merge.js';
import { createExportsForMainFiles } from '../../src/components/export/exports.js';
import { saveExportedFilesToFS } from '../../src/components/export/fs.js';
import { createVueComponent } from '../../src/components/vue.js';
import { createSvelteComponent } from '../../src/components/svelte.js';
import { createJSXComponent } from '../../src/components/jsx.js';
import { createUniqueHashContext } from '../../src/helpers/hash/context.js';
import {
	addComponentDependencies,
	createDependenciesForPackage,
} from '../../src/components/export/dependencies.js';
import type { FactoryIconData } from '../../src/components/types/data.js';
import { createSolidComponent } from '../../src/components/solid.js';

describe.skip('Creating components package with fallback', () => {
	const testModes = ['vue', 'svelte', 'react', 'solid'] as const;
	const prefix = 'ri';
	const baseDir = `temp/test-{mode}-package`;
	let iconSet: IconifyJSON;

	const names = new Set([
		'bluesky-line',
		'github-line',
		'twitter-x-line',
		'linkedin-box-line',
	]);

	beforeAll(async () => {
		// Clean up
		for (const testMode of testModes) {
			const dir = baseDir.replace('{mode}', testMode);

			// Clean up
			try {
				await rm(dir, {
					recursive: true,
				});
			} catch {
				//
			}
		}

		// Load icon set
		iconSet = await import(`@iconify-json/${prefix}/icons.json`, {
			with: { type: 'json' },
		});
	});

	for (const testMode of testModes) {
		test(`Remix Icons as ${testMode} package`, async () => {
			const dir = baseDir.replace('{mode}', testMode);
			const height: string | undefined = undefined;
			const context = createUniqueHashContext();
			const dependencies = new Set<string>();

			// Use TS for one icon with fallback and one without fallback to test both cases
			const useTS = (name: string) =>
				name === 'twitter-x-line' || name === 'github-line';

			// Options
			const options = componentFactoryFileSystemOptions({
				prefixDirsForComponents: 'components',
				doubleDirsForCSS: false,
				doubleDirsForComponents: false,
			});

			// Export all icons
			const components: FactoryComponent[] = [];

			// Test mode specific stuff
			let defaultProp: string | undefined;
			let callback: (data: FactoryIconData) => FactoryGeneratedComponent;
			let extension: (data: FactoryIconData) => string;

			switch (testMode) {
				case 'vue':
					callback = (data) =>
						createVueComponent(data, {
							context,
							...options,
							cssMode: 'import',
							height,
							ts: useTS(data.name),
						});
					extension = () => '.vue';
					break;

				case 'svelte':
					callback = (data) =>
						createSvelteComponent(data, {
							context,
							...options,
							cssMode: 'import',
							height,
							ts: useTS(data.name),
						});
					defaultProp = 'svelte';
					extension = () => '.svelte';
					break;

				case 'react':
					callback = (data) =>
						createJSXComponent(data, {
							context,
							...options,
							cssMode: 'import',
							height,
							jsx: 'react',
							fallbackPackage: '@iconify/css-react',
							ts: useTS(data.name),
						});
					extension = (data) => (useTS(data.name) ? '.tsx' : '.jsx');
					break;

				case 'solid':
					callback = (data) =>
						createSolidComponent(data, {
							context,
							...options,
							cssMode: 'import',
							height,
							ts: useTS(data.name),
						});
					extension = (data) => (useTS(data.name) ? '.tsx' : '.jsx');
					break;

				default:
					throw new Error(`Unknown test mode: ${testMode}`);
			}

			parseIconifyIconSet(iconSet, (name, data) => {
				if (data && names.has(name)) {
					// Convert icon
					const iconData = convertIconifyIconToFactoryContent(
						data,
						prefix,
						name,
						{
							context,
							throwOnCollision: true,
							prefix: 'test',
						}
					);

					// Do not use fallback for 'bluesky-line' and 'github-line'
					if (name === 'bluesky-line' || name === 'github-line') {
						delete iconData.icon.defaultFallback;
					}

					// Create component
					const result = callback(iconData);

					// Create file data
					const file = convertGeneratedComponentToFile(
						iconData,
						result,
						{
							...options,
							extension: extension(iconData),
						}
					);

					addComponentDependencies(result, dependencies);
					components.push(file);
				}
			});

			// Merge all files
			const allFiles = mergeExportedComponentFiles(components);

			// Add metadata
			const info =
				iconSet.info ??
				(await import(`@iconify-json/${prefix}/info.json`, {
					with: { type: 'json' },
				}));
			allFiles.push(
				...getIconifyIconsetMetadataAsset(
					{
						...iconSet,
						info,
					},
					options.rootPath
				)
			);

			// Create package.json
			const exports = createExportsForMainFiles(components, {
				defaultProp,
			});
			const packageJSON = {
				name: `@iconify/${prefix}-${testMode}-test`,
				type: 'module',
				version: '1.0.0',
				exports: {
					...exports,
					'./*': './*',
				},
				dependencies: createDependenciesForPackage(dependencies),
			};
			allFiles.push({
				filename: 'package.json',
				content: JSON.stringify(packageJSON, null, 2),
			});

			// Save files
			const count = await saveExportedFilesToFS(allFiles, dir);
			console.log(`Saved ${count} files to ${dir}`);
		});
	}
});
