import { stringifyStylesheet } from '../../css/stylesheet.js';
import type {
	FactoryComponent,
	GeneratedComponentFile,
} from '../types/component.js';

/**
 * Merge exported component files into single array
 */
export function mergeExportedComponentFiles(
	items: FactoryComponent[],
	files?: GeneratedComponentFile[]
): GeneratedComponentFile[] {
	const added = new Set<string>(files?.map((item) => item.filename));
	files = files ?? [];

	const add = ({ filename, content }: GeneratedComponentFile) => {
		if (!added.has(filename)) {
			added.add(filename);
			files.push({ filename, content });
		}
	};

	for (const item of items) {
		// Add all assets
		for (const asset of item.assets) {
			add(asset);
		}

		// Add component
		add(item);

		// Add style
		if (item.css && item.style) {
			add({
				filename: item.css,
				content: stringifyStylesheet(item.style),
			});
		}
	}

	return files;
}
