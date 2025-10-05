import { writeFile, mkdir } from 'node:fs/promises';
import type { GeneratedComponentFile } from '../types/component.js';

/**
 * Save exported files to filesystem
 */
export async function saveExportedFilesToFS(
	files: GeneratedComponentFile[],
	dir: string
): Promise<number> {
	let saved = 0;
	for (const { filename, content } of files) {
		const filePath = `${dir}/${filename}`;

		// Create directories if they do not exist
		const dirPath = filePath.substring(0, filePath.lastIndexOf('/'));
		try {
			await mkdir(dirPath, {
				recursive: true,
			});
		} catch {
			//
		}

		// Write file
		await writeFile(filePath, content, 'utf8');
		saved++;
	}
	return saved;
}
