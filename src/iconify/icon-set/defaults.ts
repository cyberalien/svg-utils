import type { IconifyJSON } from '@iconify/types';

const defaultProps = ['width', 'height', 'left', 'top'] as const;
type DefaultProps = (typeof defaultProps)[number];

/**
 * Get default properties from icon set
 */
export function getIconifyIconSetDefaults(data: IconifyJSON) {
	// Get default values
	const defaultValues: Partial<Record<DefaultProps, number>> = {};
	for (const prop of defaultProps) {
		const defaultValue = data[prop];
		if (defaultValue) {
			defaultValues[prop] = defaultValue;
		}
	}
	return defaultValues;
}
