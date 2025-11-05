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
	// Cannot be used with CSS modules
	styleInComponent?: boolean | 'svelte';
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

	// Merge CSS animations into CSS files for classes that use those animations
	const { cssMode } = options;
	const isModule = cssMode === 'module';
	const isFile = cssMode === 'prop';

	const styleInComponent = isFile
		? 'file'
		: (!isModule && options.styleInComponent) ?? false;
	const mergeCSS = (isFile || styleInComponent || options.mergeCSS) ?? false;
	const embedAnimations = isModule && !mergeCSS;

	const classNamePrefix = styleInComponent === 'svelte' ? ':global ' : '';
	const keyframesPrefix = styleInComponent === 'svelte' ? '-global-' : '';

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
			} else if (!isFile) {
				imports.css.add(mergeCSS.import);
			}
		}

		// Return merged content
		return styleInComponent ? content : undefined;
	}

	return;
}
