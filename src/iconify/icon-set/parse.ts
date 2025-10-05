import type { IconifyJSON } from '@iconify/types';
import type { ParseIconifyIconSetCallback } from './types.js';
import { getIconifyIconSetDefaults } from './defaults.js';

/**
 * Parse Iconify icon set and call callback for each icon
 */
export function parseIconifyIconSet(
	data: IconifyJSON,
	callback: ParseIconifyIconSetCallback
) {
	const defaultValues = getIconifyIconSetDefaults(data);

	// Parse all icons
	for (const name in data.icons) {
		const item = data.icons[name];
		callback(name, {
			...defaultValues,
			...item,
		});
	}

	// Parse aliases
	if (data.aliases) {
		for (const name in data.aliases) {
			const item = data.aliases[name];
			const parentIcon = data.icons[item.parent];
			if (!parentIcon) {
				// Parent does not exist or is also an alias
				callback(name, null);
				continue;
			}
			callback(name, {
				...defaultValues,
				...parentIcon,
				...item,
			});
		}
	}

	// Parse missing icons
	if (data.not_found) {
		for (const name of data.not_found) {
			callback(name, null);
		}
	}
}
