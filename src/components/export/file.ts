import type {
	FactoryComponent,
	FactoryGeneratedComponent,
} from '../types/component.js';

/**
 * Add icon and filename to generated component
 */
export function convertGeneratedComponentToFile(
	icon: string,
	filename: string,
	item: FactoryGeneratedComponent
): FactoryComponent {
	return {
		icon,
		filename,
		...item,
	};
}
