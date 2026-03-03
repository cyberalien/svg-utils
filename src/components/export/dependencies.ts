import type { FactoryGeneratedComponent } from '../types/component.js';

// Latest versions of common dependencies
const latestVersions: Record<string, string> = {};

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
	dependencies: Set<string>
): Record<string, string> | undefined {
	if (dependencies.size) {
		const result = Object.create(null) as Record<string, string>;
		for (const dependency of dependencies) {
			result[dependency] = latestVersions[dependency] || 'latest';
		}
		return result;
	}
}
