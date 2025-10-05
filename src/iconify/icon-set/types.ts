import type { IconifyIcon } from '@iconify/types';

/**
 * Callback for each icon in icon set
 */
export type ParseIconifyIconSetCallback = (
	name: string,
	data: IconifyIcon | null
) => void;
