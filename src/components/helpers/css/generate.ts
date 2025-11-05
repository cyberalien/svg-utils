import {
	stringifyCSSKeyframes,
	stringifyCSSSelector,
} from '../../../css/stringify.js';
import { getGeneratedCSSFilename } from '../filenames/css.js';
import type { ComponentFactoryOptions } from '../../types/options.js';
import type { ComponentFactorySource } from '../../types/source.js';
import { generateCSSDefaultImportName } from './name.js';
import type { FactoryComponentImports } from '../imports/types.js';
import type { GeneratedAssetFile } from '../../types/component.js';

interface Options
	extends Pick<
		ComponentFactoryOptions,
		'cssMode' | 'cssPath' | 'doubleDirsForCSS' | 'mergeCSS'
	> {
	// Style in component mode: merge CSS, do not add assets, merge content
	componentType?: 'svelte';
}

/**
 * Generate CSS files for component
 *
 * Adds imports to imports object, adds assets
 */
export function generateCSSFilesForComponent(
	content: ComponentFactorySource,
	imports: FactoryComponentImports,
	assets: GeneratedAssetFile[],
	options: Options
): string | undefined {
	const { classes, keyframes } = content;
	if (!classes) {
		// Nothing to do
		// Keyframes without classes is useless
		return;
	}

	// Check CSS mode
	const { cssMode, componentType } = options;
	const isComponent = cssMode === 'embed';
	const returnCSS = isComponent || cssMode === 'prop';
	const isModule = cssMode === 'module';

	// Check if CSS should be merged
	const mergeCSS = (returnCSS || options.mergeCSS) ?? false;
	const embedAnimations = isModule && !mergeCSS;

	// Get class name/keyframe name prefixes for components
	const classNamePrefix =
		isComponent && componentType === 'svelte' ? ':global ' : '';
	const keyframesPrefix =
		isComponent && componentType === 'svelte' ? '-global-' : '';

	// All content
	const mergedContent: string[] = [];

	// Generate all classes
	for (const className in classes) {
		// Generate content
		const baseContent = stringifyCSSSelector(
			`${classNamePrefix}.${className}`,
			classes[className]
		);
		let content = baseContent;

		// Add keyframes
		if (embedAnimations && keyframes) {
			for (const animationName in keyframes) {
				if (baseContent.includes(animationName)) {
					const value = keyframes[animationName];
					content +=
						'\n' +
						(typeof value === 'string'
							? value
							: stringifyCSSKeyframes(
									keyframesPrefix + animationName,
									value
							  ));
				}
			}
		}

		if (mergeCSS) {
			mergedContent.push(content);
			continue;
		}

		// Generate asset
		const filename = getGeneratedCSSFilename(className, options);
		assets.push({
			...filename,
			content,
		});

		// Add import
		if (isModule) {
			imports.modules[filename.import] =
				generateCSSDefaultImportName(className);
		} else {
			imports.css.add(filename.import);
		}
	}

	// Generate keyframes
	if (!embedAnimations && keyframes) {
		for (const animationName in keyframes) {
			const value = keyframes[animationName];
			const content =
				typeof value === 'string'
					? value
					: stringifyCSSKeyframes(
							keyframesPrefix + animationName,
							value
					  );

			if (mergeCSS) {
				mergedContent.push(content);
				continue;
			}

			// Generate asset
			const filename = getGeneratedCSSFilename(animationName, options);
			assets.push({
				...filename,
				content,
			});

			// Add import
			if (isModule) {
				// This code should not be used, but just in case
				imports.modules[filename.import] =
					generateCSSDefaultImportName(animationName);
			} else {
				imports.css.add(filename.import);
			}
		}
	}

	// Generate merged file
	if (mergeCSS && mergedContent.length) {
		const content = mergedContent.join('\n');

		if (typeof mergeCSS == 'object') {
			assets.push({
				...mergeCSS,
				content,
			});

			// Add import
			if (isModule) {
				imports.modules[mergeCSS.import] = 'css';
			} else if (!returnCSS) {
				imports.css.add(mergeCSS.import);
			}
		}

		// Return merged content
		return returnCSS ? content : undefined;
	}

	return;
}
