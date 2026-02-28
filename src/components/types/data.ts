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
}
