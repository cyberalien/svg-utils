import { getGeneratedCSSFilename } from '../filenames/css.js';
import type { ComponentFactoryOptions } from '../../types/options.js';
import type { ComponentFactorySource } from '../../types/source.js';
import type { FactoryComponentImports } from '../imports/types.js';
import type { GeneratedAssetFile } from '../../types/component.js';
import type {
	CSSGeneratedSelectors,
	CSSGeneratedStylesheet,
} from '../../../css/types.js';
import {
	createEmptyStylesheet,
	stringifyStylesheet,
} from '../../../css/stylesheet.js';
import { renderStatefulSVGCSSIconStyle } from '../../../svg-css/icon/css.js';

interface Options extends Pick<
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
	content: Omit<ComponentFactorySource, 'viewBox'>,
	imports: FactoryComponentImports,
	assets: GeneratedAssetFile[],
	options: Options
): CSSGeneratedStylesheet | undefined {
	if (!content.classes) {
		// Nothing to do
		return;
	}

	// Check CSS mode
	const { cssMode, componentType } = options;
	const isComponent = cssMode === 'embed';
	const returnCSS = isComponent || cssMode === 'prop';

	// Check if CSS should be merged
	const mergeCSS = (returnCSS || options.mergeCSS) ?? false;
	const commonStylesheet = mergeCSS ? createEmptyStylesheet() : undefined;

	// Check for stateful data
	const statefulData = content.statefulData;

	// Render stylesheets
	const stylesheets = renderStatefulSVGCSSIconStyle(
		content,
		statefulData?.context ?? null,
		commonStylesheet
	);

	// Update stylesheets for Svelte components
	if (isComponent && componentType === 'svelte') {
		const list = commonStylesheet
			? [commonStylesheet]
			: Object.values(stylesheets);

		const wrapSelectors = (selectors: CSSGeneratedSelectors) => {
			const keys = Object.keys(selectors);
			for (const selector of keys) {
				const value = selectors[selector];
				if (!selector.startsWith('@')) {
					delete selectors[selector];
					const newSelector = selector
						.split(',')
						.map((item) => `:global(${item.trim()})`)
						.join(', ');
					selectors[newSelector] = value;
				}

				if (value.nested) {
					wrapSelectors(value.nested);
				}
			}
		};

		for (const stylesheet of list) {
			// Wrap all selectors in :global
			wrapSelectors(stylesheet.selectors);

			// Add -global- prefix to all keyframes
			const keyframes = stylesheet.keyframes;
			const animations = Object.keys(keyframes);
			for (const animationName of animations) {
				const animation = keyframes[animationName];
				delete keyframes[animationName];
				keyframes['-global-' + animationName] = animation;
			}
		}
	}

	// Add assets
	if (!mergeCSS) {
		for (const className in stylesheets) {
			const stylesheet = stylesheets[className];
			const content = stringifyStylesheet(stylesheet);

			if (content) {
				// Generate asset
				const filename = getGeneratedCSSFilename(className, options);
				assets.push({
					...filename,
					content,
				});

				// Add import
				imports.css.add(filename.import);
			}
		}
	} else if (typeof mergeCSS == 'object') {
		const content = stringifyStylesheet(commonStylesheet!);

		if (content) {
			assets.push({
				...mergeCSS,
				content,
			});

			// Add import
			imports.css.add(mergeCSS.import);
		}
	}

	// Return stylesheet
	return returnCSS ? commonStylesheet : undefined;
}
