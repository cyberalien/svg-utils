import type { IconifyIcon, IconifyJSON } from '@iconify/types';
import { convertSVGContentToCSSRules } from '../../svg-css/content.js';
import type { ConvertSVGContentOptions } from '../../svg-css/types.js';
import type { FactoryIconData } from '../types/data.js';
import { normaliseIconifyIcon } from '../../iconify/icon/normalise.js';
import { getGeneratedAssetFilename } from '../helpers/filenames/asset.js';
import type { GeneratedAssetPath } from '../types/options.js';
import type { GeneratedAssetFile } from '../types/component.js';

interface Options extends ConvertSVGContentOptions {
	fallback?: string | boolean;
}

/**
 * Convert IconifyIcon data to FactoryIconData
 */
export function convertIconifyIconToFactoryContent(
	icon: IconifyIcon,
	prefix: string,
	name: string,
	options: Options
): FactoryIconData {
	const { body, viewBox } = normaliseIconifyIcon(icon);
	const fallbackOption = options?.fallback ?? true;
	const defaultFallback =
		typeof fallbackOption === 'string'
			? fallbackOption
			: fallbackOption
				? `${prefix}:${name}`
				: undefined;

	return {
		prefix,
		name,
		icon: {
			...convertSVGContentToCSSRules(body, options),
			viewBox,
			defaultFallback,
		},
	};
}

/**
 * Create metadata assets for an icon set
 */
export function getIconifyIconsetMetadataAsset(
	iconSet: Pick<IconifyJSON, 'prefix' | 'info' | 'lastModified'>,
	rootPath: GeneratedAssetPath
): GeneratedAssetFile[] {
	const assets: GeneratedAssetFile[] = [];

	// Get info and last modified
	const { prefix, info, lastModified } = iconSet;
	const metadata: Pick<IconifyJSON, 'prefix' | 'info' | 'lastModified'> = {
		prefix,
		info,
		lastModified,
	};
	assets.push({
		...getGeneratedAssetFilename('iconify.json', rootPath),
		content: JSON.stringify(metadata, null, '\t') + '\n',
	});

	return assets;
}
