import type { IconViewBox } from '../../svg/viewbox/types.js';
import type { ComponentFactorySource } from './source.js';

/**
 * Icon data
 */
export interface FactoryIconData {
	// Icon prefix
	prefix: string;

	// Icon name
	name: string;

	// Icon data
	icon: ComponentFactorySource;

	// Icon viewBox
	viewBox: IconViewBox;

	// Fallback icon name, if fallback is used
	fallback?: string;
}
