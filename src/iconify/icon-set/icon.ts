import type { IconifyIcon, IconifyJSON } from '@iconify/types';
import { getIconifyIconSetDefaults } from './defaults.js';

/**
 * Get icon data from Iconify icon set
 */
export function getIconifyIconSetIcon(
	data: IconifyJSON,
	name: string
): IconifyIcon | null | undefined {
	if (data.not_found?.includes(name)) {
		// Icon is missing
		return null;
	}

	// Get icon
	const icon = data.icons[name];
	if (icon) {
		return {
			...getIconifyIconSetDefaults(data),
			...icon,
		};
	}

	// Check alias
	const alias = data.aliases?.[name];
	if (alias) {
		const parentIcon = data.icons?.[alias.parent];
		return parentIcon
			? {
					...getIconifyIconSetDefaults(data),
					...parentIcon,
					...alias,
			  }
			: null;
	}
}
