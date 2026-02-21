/**
 * List of imports for component
 */
export interface FactoryComponentImports {
	// Default imports: key is import path, value is imported name
	default: Record<string, string>;

	// Named imports: key is import path, value is list of imported names
	named: Record<string, Set<string>>;

	// Type imports
	// Same as named but for 'import type'
	types: Record<string, Set<string>>;

	// Full imports
	full: Set<string>;

	// CSS imports, value is import path
	// Same as 'full' but split for clarity
	css: Set<string>;
}
