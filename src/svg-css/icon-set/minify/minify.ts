import {
	compactItem,
	createCompactContext,
} from '../../../helpers/data/compact.js';
import type { IconViewBox } from '../../../svg/viewbox/types.js';
import { stringifyIconViewBox } from '../../../svg/viewbox/value.js';
import type { IconStatesList } from '../../states/types.js';
import type { SVGCSSIconSet } from '../types.js';
import {
	iconSetMinifyKeys,
	iconSetMinifySimpleKeys,
	iconSetMinifyStatefulKeys,
} from './keys.js';

// All keys that can be minified
type Keys = (typeof iconSetMinifyKeys)[number];

// Context: map and data for all items
interface Context extends Record<
	Keys,
	ReturnType<typeof createCompactContext<string>>
> {
	viewBox: ReturnType<typeof createCompactContext<IconViewBox | string>>;
	states: ReturnType<typeof createCompactContext<IconStatesList>>;
}

/**
 * Create context for minification
 */
export function createIconSetMinifyContext(): Context {
	const result = Object.create(null) as Context;
	for (const key of iconSetMinifyKeys) {
		result[key] = createCompactContext();
	}
	result.viewBox = createCompactContext();
	result.states = createCompactContext();
	return result;
}

/**
 * Get key for viewBox
 */
function viewBoxKey(viewBox: string | IconViewBox): string {
	return typeof viewBox === 'string'
		? viewBox
		: stringifyIconViewBox(viewBox) +
				('cx' in viewBox ? ` ${viewBox.cx}` : '');
}

/**
 * Minify icon set
 */
export function minifySVGCSSIconSet(iconSet: SVGCSSIconSet) {
	// Create new context, scan existing items
	const context = createIconSetMinifyContext();
	const viewBoxes = context.viewBox;
	const statesList = context.states;

	// Add existing items
	if (iconSet.viewBoxes) {
		viewBoxes.data = [...iconSet.viewBoxes];
	}
	viewBoxes.data.forEach((value, index) => {
		const key = viewBoxKey(value);
		viewBoxes.map.set(key, index);
	});

	if (iconSet.statesList) {
		statesList.data = [...iconSet.statesList];
	}
	statesList.data.forEach((value, index) => {
		const key = JSON.stringify(value);
		statesList.map.set(key, index);
	});

	for (const prop of iconSetMinifyKeys) {
		context[prop].data = [...(iconSet.css?.[prop] ?? [])];
		const { data, map } = context[prop];
		data.forEach((value, index) => {
			map.set(value, index);
		});
	}

	// Fallback prefix
	if (!iconSet.fallbackPrefix) {
		let commonPrefix: string | null | undefined;
		for (const iconName in iconSet.icons) {
			const icon = iconSet.icons[iconName];
			const fallback = icon.fallback;
			if (fallback) {
				const parts = fallback.split(':');
				if (parts.length !== 2) {
					commonPrefix = null;
					break;
				}

				const prefix = parts[0];
				if (commonPrefix === undefined) {
					commonPrefix = prefix;
				} else if (commonPrefix !== prefix) {
					commonPrefix = null;
					break;
				}
			}
		}

		if (commonPrefix) {
			// Slice all fallback values
			iconSet.fallbackPrefix = `${commonPrefix}:`;
			for (const iconName in iconSet.icons) {
				const icon = iconSet.icons[iconName];
				const fallback = icon.fallback;
				if (fallback) {
					icon.fallback = fallback.slice(commonPrefix.length + 1);
				}
			}
		}
	}

	// Parse viewBox and states
	for (const iconName in iconSet.icons) {
		const icon = iconSet.icons[iconName];

		const viewBoxValue = icon.viewBox;
		if (typeof viewBoxValue !== 'number') {
			// Minify viewBox
			compactItem(
				viewBoxes,
				viewBoxKey(viewBoxValue),
				icon as unknown as Record<string, unknown>,
				'viewBox',
				viewBoxValue
			);
		}

		const statesValue = icon.states;
		if (typeof statesValue !== 'number' && statesValue?.length) {
			// Minify states
			compactItem(
				statesList,
				JSON.stringify(statesValue),
				icon as unknown as Record<string, unknown>,
				'states',
				statesValue
			);
		}
	}

	// Parse all classes
	if (iconSet.classes) {
		for (const className in iconSet.classes) {
			const classContent = iconSet.classes[className];

			// Base rules
			for (const prop of iconSetMinifySimpleKeys) {
				if (typeof classContent[prop] === 'string') {
					compactItem(
						context[prop],
						classContent[prop],
						classContent as unknown as Record<string, unknown>,
						prop
					);
				}
			}

			// Stateful rules
			for (const prop of iconSetMinifyStatefulKeys) {
				const value = classContent[prop];
				if (value) {
					for (const state in value) {
						if (typeof value[state] === 'string') {
							compactItem(
								context[prop],
								value[state],
								value,
								state
							);
						}
					}
				}
			}
		}
	}

	// Update data from context
	iconSet.viewBoxes = viewBoxes.data.length ? viewBoxes.data : undefined;
	iconSet.statesList = statesList.data.length ? statesList.data : undefined;
	delete iconSet.css;
	for (const prop of iconSetMinifyKeys) {
		const data = context[prop].data;
		if (data.length) {
			if (!iconSet.css) {
				iconSet.css = Object.create(null);
			}
			iconSet.css![prop] = data;
		}
	}
}
