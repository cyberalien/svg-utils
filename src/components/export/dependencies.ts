import type { FactoryGeneratedComponent } from '../types/component.js';

/**
 * Add component dependencies to set
 */
export function addComponentDependencies(
	component: FactoryGeneratedComponent,
	dependencies: Set<string>
) {
	if (component.dependencies) {
		for (const dependency of component.dependencies) {
			dependencies.add(dependency);
		}
	}
}

/**
 * Create dependencies list for package.json
 */
export function createDependenciesForPackage(
	dependencies: Set<string>,
	customVersions?: Record<string, string>
): Record<string, string> | undefined {
	if (dependencies.size) {
		const result = Object.create(null) as Record<string, string>;
		for (const dependency of dependencies) {
			result[dependency] = customVersions?.[dependency] ?? 'latest';
		}
		return result;
	}
}
