import { splitClassName } from '../../classname/toggle.js';
import { changeSVGIDs } from '../../svg/ids/change.js';
import { iterateXMLContent } from '../../xml/iterate.js';
import { parseXMLContent } from '../../xml/parse.js';
import { stringifyXMLContent } from '../../xml/stringify.js';
import type { SVGCSSStatefulIcon, SVGCSSIcon } from './types.js';

/**
 * Change class names in icon
 *
 * Optionally change IDs in icon if idsCallback is provided
 */
export function changeSVGCSSIconClassnames<
	T extends SVGCSSStatefulIcon | SVGCSSIcon,
>(
	icon: T,
	callback: (value: string) => string,
	idsCallback?: (id: string, content: string, tagName: string) => string
): T {
	const newClassNames = new Map<string, string>();

	// Find all classes in content
	const root = parseXMLContent(icon.content);
	if (!root) {
		return icon;
	}
	iterateXMLContent(root, (node) => {
		if (node.type === 'tag' && typeof node.attribs['class'] === 'string') {
			const classNames = splitClassName(node.attribs['class']).map(
				(className) => {
					const renamed = newClassNames.get(className);
					if (renamed) {
						return renamed;
					}
					const newName = callback(className);
					if (newName) {
						newClassNames.set(className, newName);
						return newName;
					}
					return className;
				}
			);
			node.attribs['class'] = classNames.join(' ');
		}
	});
	if (idsCallback) {
		changeSVGIDs(root, idsCallback);
	}

	const content = stringifyXMLContent(root);
	if (!content) {
		return icon;
	}

	// New icon
	const newIcon: SVGCSSStatefulIcon = {
		...icon,
		content,
	};

	const keys: (keyof SVGCSSStatefulIcon)[] = [
		'classes',
		'statefulClasses',
		'animations',
	] as const;
	for (const key of keys) {
		const data = icon[key as 'classes'];
		if (data) {
			const newData = Object.create(null) as typeof data;
			for (const className in data) {
				const newName = newClassNames.get(className) ?? className;
				newData[newName] = data[className];
			}
			newIcon[key as 'classes'] = newData as (typeof newIcon)['classes'];
		}
	}

	return newIcon as T;
}
