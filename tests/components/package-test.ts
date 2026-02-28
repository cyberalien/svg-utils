import { rm } from 'node:fs/promises';
import type { IconifyJSON } from '@iconify/types';
import { createVueComponent } from '../../src/components/vue.js';
import { componentFactoryFileSystemOptions } from '../../src/components/prepare/options.js';
import type { FactoryComponent } from '../../src/components/types/component.js';
import { parseIconifyIconSet } from '../../src/iconify/icon-set/parse.js';
import {
	convertIconifyIconToFactoryContent,
	getIconifyIconsetMetadataAsset,
} from '../../src/components/prepare/iconify.js';
import { convertGeneratedComponentToFile } from '../../src/components/export/file.js';
import { mergeExportedComponentFiles } from '../../src/components/export/merge.js';
import { createExportsForMainFiles } from '../../src/components/export/exports.js';
import { saveExportedFilesToFS } from '../../src/components/export/fs.js';
import { createSvelteComponent } from '../../src/components/svelte.js';
import { createUniqueHashContext } from '../../src/helpers/hash/context.js';

describe.skip('Creating components package with fallback', () => {
	const testModes = ['vue', 'svelte'] as const;
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
			// Test mode specific stuff
			const testFunction =
				testMode === 'vue' ? createVueComponent : createSvelteComponent;
			const defaultProp = testMode === 'svelte' ? testMode : undefined;
			const dir = baseDir.replace('{mode}', testMode);
			const cssMode = 'embed'; //testMode === 'svelte' ? 'embed' : 'import';
			const useFallback = true;
			const height: string | undefined = undefined;
			const context = createUniqueHashContext();

			// Options
			const options = componentFactoryFileSystemOptions({
				prefixDirsForComponents: 'components',
				doubleDirsForCSS: false,
				doubleDirsForComponents: false,
			});

			// Export all icons
			const components: FactoryComponent[] = [];

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
					if (!useFallback) {
						delete iconData.icon.defaultFallback;
					}

					// Create component
					const result = testFunction(iconData, {
						context,
						...options,
						cssMode,
						height,
					});

					// Create file data
					const file = convertGeneratedComponentToFile(
						iconData,
						result,
						{
							...options,
							extension: `.${testMode}`,
						}
					);

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
