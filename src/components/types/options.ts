import type { CSSExportMode } from './css.js';

/**
 * Asset path, generated from configuration
 */
export interface GeneratedAssetPath {
	// Path relative to root
	filename: string;

	// Import path, relative to component file
	import: string;
}

/**
 * File system options for component factory
 */
export interface ComponentFactoryFileSystemOptions {
	// Double directories for CSS files: 'a/abc.css' instead of 'abc.css'
	doubleDirsForCSS: boolean;

	// Add prefix directory for components: 'mdi/home.vue'
	prefixDirsForComponents: boolean | string;

	// Double directories for components: 'a/abc.tsx' instead of 'abc.tsx'
	doubleDirsForComponents: boolean;

	// Path to root directory. Assets will be placed in subdirectory of this path
	rootPath: GeneratedAssetPath;

	// Path to generated CSS files
	cssPath: GeneratedAssetPath;

	// Shared type files
	sharedTypes?: boolean;
}

/**
 * Rendering options for component factory
 */
export interface ComponentFactoryRenderingOptions {
	// Add square parameter for non-square icons
	square?: boolean;

	// CSS export mode
	cssMode: CSSExportMode;

	// Merge all CSS into single file, value is filename
	// Should not be used with cssMode='file'
	mergeCSS?: GeneratedAssetPath;

	// Hardcoded width attribute
	width?: string;

	// Hardcoded height attribute
	height?: string;
}

/**
 * Options for component factory
 */
export interface ComponentFactoryOptions
	extends ComponentFactoryFileSystemOptions,
		ComponentFactoryRenderingOptions {
	//
}
