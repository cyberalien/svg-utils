import { splitClassName } from '../../classname/toggle.js';

/**
 * Find class names in content
 */
export function findUsedClassNames(content: string): string[] {
	const classNames = new Set<string>();
	content.matchAll(/class=["']([^"']+)["']/g).forEach((match) => {
		splitClassName(match[1]).forEach((className) =>
			classNames.add(className)
		);
	});
	return Array.from(classNames);
}
