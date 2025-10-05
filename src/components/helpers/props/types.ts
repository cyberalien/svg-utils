/**
 * Dynamic property value
 */
export interface FactoryComponentDynamicProp {
	// Type, used for generating types
	type?: string;
	required?: boolean;

	// Raw value code
	value?: string;

	// Custom template
	template?: string;
}

/**
 * Properties for component
 */
export type FactoryComponentProps = Record<
	string,
	string | FactoryComponentDynamicProp
>;
