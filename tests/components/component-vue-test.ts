import { convertIconifyIconToFactoryContent } from '../../src/components/prepare/iconify.js';
import { createVueComponent } from '../../src/components/vue.js';
import { componentFactoryFileSystemOptions } from '../../src/components/prepare/options.js';
import type { FactoryIconData } from '../../src/components/types/data.js';
import { getGeneratedAssetFilename } from '../../src/components/helpers/filenames/asset.js';
import { getGeneratedComponentFilename } from '../../src/components/export/filename.js';
import { createUniqueHashContext } from '../../src/helpers/hash/context.js';
import { stringifyStylesheet } from '../../src/css/stylesheet.js';

describe('Creating Vue components', () => {
	it('Simple icon', () => {
		const context = createUniqueHashContext();
		const options = componentFactoryFileSystemOptions({});
		const data: FactoryIconData = {
			prefix: 'test',
			name: 'icon',
			viewBox: {
				width: 24,
				height: 24,
			},
			icon: {
				content:
					'<path d="M0 0l24 24" stroke="currentColor" fill="none" />',
			},
		};
		const result = createVueComponent(data, {
			context,
			...options,
			cssMode: 'import',
		});
		// console.log(result.content);
		expect(result.content).toBe(
			`<script setup>
import { computed } from 'vue';
import { getSizeProps } from '../helpers/size.js';

const props = defineProps(["width","height"]);

const viewBox = '0 0 24 24';
const size = computed(() => getSizeProps(props.width, props.height, 1));
const content = \`<path d="M0 0l24 24" stroke="currentColor" fill="none" />\`;
</script>
<template><svg xmlns="http://www.w3.org/2000/svg" v-bind="size" :viewBox="viewBox" v-html="content" /></template>
`
		);
		expect(result.assets).toHaveLength(2);
		expect(result.assets[0].filename).toBe('helpers/size.js');
		expect(result.assets[1].filename).toBe('i/icon.d.ts');
		expect(result.style).toBeUndefined();

		// Check types
		expect(result.assets[1].content)
			.toBe(`import { DefineSetupFnComponent, PublicProps } from 'vue';

interface IconProps {
	width?: string;
	height?: string;
}

declare const Component: DefineSetupFnComponent<IconProps, {}, {}, IconProps & {}, PublicProps>;

export { type IconProps };
export default Component;
`);
	});

	it('Icon with CSS, hardcoded size', () => {
		const context = createUniqueHashContext();
		const options = componentFactoryFileSystemOptions({
			doubleDirsForCSS: false,
			doubleDirsForComponents: false,
		});

		// Convert IconifyIcon and test it
		const data = convertIconifyIconToFactoryContent(
			{
				body: '<path d="M0 0l16 16" fill="currentColor" />',
			},
			'test-prefix',
			'line-icon',
			{ context, fallback: false }
		);
		expect(data.prefix).toBe('test-prefix');
		expect(data.name).toBe('line-icon');
		expect(data.viewBox).toEqual({
			left: 0,
			top: 0,
			width: 16,
			height: 16,
		});
		expect(data.fallback).toBeUndefined();

		// Get class name
		const classNames = Object.keys(data.icon.classes ?? {});
		expect(classNames).toHaveLength(1);
		const testClassName = classNames[0];

		// Generate component
		const result = createVueComponent(data, {
			context,
			...options,
			cssMode: 'import',
			height: '1em',
		});

		// console.log(result.content);
		expect(result.content).toBe(
			`<script setup>
import './css/${testClassName}.css';

const viewBox = '0 0 16 16';
const content = \`<path class="${testClassName}"/>\`;
</script>
<template><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" :viewBox="viewBox" v-html="content" /></template>
`
		);
		expect(result.assets).toHaveLength(2);
		expect(result.assets[0].filename).toBe(`css/${testClassName}.css`);
		expect(result.assets[1].filename).toBe('line-icon.d.ts');
		expect(result.style).toBeUndefined();

		// Check types
		expect(result.assets[1].content)
			.toBe(`import { DefineSetupFnComponent, PublicProps } from 'vue';

interface IconProps {

}

declare const Component: DefineSetupFnComponent<IconProps, {}, {}, IconProps & {}, PublicProps>;

export { type IconProps };
export default Component;
`);
	});

	it('Icon with CSS, TypeScript', () => {
		const context = createUniqueHashContext();
		const options = componentFactoryFileSystemOptions({
			doubleDirsForCSS: false,
			doubleDirsForComponents: false,
		});

		// Convert IconifyIcon and test it
		const data = convertIconifyIconToFactoryContent(
			{
				body: '<path d="M0 0l16 16" fill="currentColor" />',
			},
			'test-prefix',
			'line-icon',
			{
				context,
				fallback: false,
			}
		);
		expect(data.prefix).toBe('test-prefix');
		expect(data.name).toBe('line-icon');
		expect(data.viewBox).toEqual({
			left: 0,
			top: 0,
			width: 16,
			height: 16,
		});
		expect(data.fallback).toBeUndefined();

		// Get class name
		const classNames = Object.keys(data.icon.classes ?? {});
		expect(classNames).toHaveLength(1);
		const testClassName = classNames[0];

		// Generate component
		const result = createVueComponent(data, {
			context,
			...options,
			cssMode: 'import',
			ts: true,
		});

		// console.log(result.content);
		expect(result.content).toBe(
			`<script setup lang="ts">
import { computed } from 'vue';
import { getSizeProps } from './helpers/size.js';
import './css/${testClassName}.css';

const props = defineProps<{
\twidth?: string;
\theight?: string;
}>();

const viewBox = '0 0 16 16';
const size = computed(() => getSizeProps(props.width, props.height, 1));
const content = \`<path class="${testClassName}"/>\`;
</script>
<template><svg xmlns="http://www.w3.org/2000/svg" v-bind="size" :viewBox="viewBox" v-html="content" /></template>
`
		);
		expect(result.assets).toHaveLength(3);
		expect(result.assets[0].filename).toBe(`css/${testClassName}.css`);
		expect(result.assets[1].filename).toBe('helpers/size.js');
		expect(result.assets[2].filename).toBe('line-icon.d.ts');
		expect(result.style).toBeUndefined();

		// Check types
		expect(result.assets[2].content)
			.toBe(`import { DefineSetupFnComponent, PublicProps } from 'vue';

interface IconProps {
	width?: string;
	height?: string;
}

declare const Component: DefineSetupFnComponent<IconProps, {}, {}, IconProps & {}, PublicProps>;

export { type IconProps };
export default Component;
`);
	});

	it('Icon with CSS, using separate file', () => {
		const context = createUniqueHashContext();
		const options = componentFactoryFileSystemOptions({
			doubleDirsForCSS: true, // Ignored
			doubleDirsForComponents: false,
		});

		// Convert IconifyIcon and test it
		const prefix = 'test-prefix';
		const name = 'line-icon';
		const data = convertIconifyIconToFactoryContent(
			{
				body: '<path d="M0 0l16 16" fill="currentColor" />',
			},
			prefix,
			name,
			{ context, fallback: false }
		);
		expect(data.prefix).toBe(prefix);
		expect(data.name).toBe(name);
		expect(data.viewBox).toEqual({
			left: 0,
			top: 0,
			width: 16,
			height: 16,
		});
		expect(data.fallback).toBeUndefined();

		// Get class name
		const classNames = Object.keys(data.icon.classes ?? {});
		expect(classNames).toHaveLength(1);
		const testClassName = classNames[0];

		// Generate component
		const cssFilename = getGeneratedComponentFilename(
			{ prefix, name },
			'.css',
			options
		);
		const result = createVueComponent(data, {
			context,
			...options,
			cssMode: 'prop',
			// Should be ignored
			mergeCSS: {
				filename: cssFilename,
				import: `./${cssFilename}`,
			},
		});

		// console.log(result.content);
		expect(result.content).toBe(
			`<script setup>
import { computed } from 'vue';
import { getSizeProps } from './helpers/size.js';

const props = defineProps(["width","height"]);

const viewBox = '0 0 16 16';
const size = computed(() => getSizeProps(props.width, props.height, 1));
const content = \`<path class="${testClassName}"/>\`;
</script>
<template><svg xmlns="http://www.w3.org/2000/svg" v-bind="size" :viewBox="viewBox" v-html="content" /></template>
`
		);
		expect(result.assets).toHaveLength(2);
		expect(result.assets[0].filename).toBe('helpers/size.js');
		expect(result.assets[1].filename).toBe('line-icon.d.ts');

		// Check CSS
		expect(result.style ? stringifyStylesheet(result.style) : '').toBe(
			`.${testClassName} {\n  d: path("M0 0l16 16");\n  fill: currentColor;\n}\n`
		);

		// Check types
		expect(result.assets[1].content)
			.toBe(`import { DefineSetupFnComponent, PublicProps } from 'vue';

interface IconProps {
	width?: string;
	height?: string;
}

declare const Component: DefineSetupFnComponent<IconProps, {}, {}, IconProps & {}, PublicProps>;

export { type IconProps };
export default Component;
`);
	});

	it('Square property', () => {
		const context = createUniqueHashContext();
		const options = componentFactoryFileSystemOptions({});
		const data: FactoryIconData = {
			prefix: 'test',
			name: 'icon',
			viewBox: {
				width: 20,
				height: 24,
			},
			icon: {
				content:
					'<path d="M0 0l20 24" stroke="currentColor" fill="none" />',
			},
		};
		const result = createVueComponent(data, {
			context,
			...options,
			cssMode: 'import',
			square: true,
		});
		// console.log(result.content);
		expect(result.content).toBe(
			`<script setup>
import { computed } from 'vue';
import { getSizeProps } from '../helpers/size.js';

const props = defineProps(["width","height","square"]);

const baseViewBox = '0 0 20 24';
const squareViewBox = '-2 0 24 24';
const viewBox = computed(() => props.square ? squareViewBox : baseViewBox);
const ratio = computed(() => props.square ? 1 : 0.84);
const size = computed(() => getSizeProps(props.width, props.height, ratio.value));
const content = \`<path d="M0 0l20 24" stroke="currentColor" fill="none" />\`;
</script>
<template><svg xmlns="http://www.w3.org/2000/svg" v-bind="size" :viewBox="viewBox" v-html="content" /></template>
`
		);
		expect(result.assets).toHaveLength(2);
		expect(result.assets[0].filename).toBe('helpers/size.js');
		expect(result.assets[1].filename).toBe('i/icon.d.ts');
		expect(result.style).toBeUndefined();

		// Check types
		expect(result.assets[1].content)
			.toBe(`import { DefineSetupFnComponent, PublicProps } from 'vue';

interface IconProps {
	width?: string;
	height?: string;
	square?: boolean;
}

declare const Component: DefineSetupFnComponent<IconProps, {}, {}, IconProps & {}, PublicProps>;

export { type IconProps };
export default Component;
`);
	});

	it('Square property with hardcoded size', () => {
		const context = createUniqueHashContext();
		const options = componentFactoryFileSystemOptions({});
		const data: FactoryIconData = {
			prefix: 'test',
			name: 'icon',
			viewBox: {
				width: 24,
				height: 24,
			},
			icon: {
				content:
					'<path d="M0 0l24 24" stroke="currentColor" fill="none" />',
			},
		};
		const result = createVueComponent(data, {
			context,
			...options,
			cssMode: 'import',
			square: true,
			width: '1em',
			height: '1em',
		});
		// console.log(result.content);
		expect(result.content).toBe(
			`<script setup>

const props = defineProps(["square"]);

const viewBox = '0 0 24 24';
const content = \`<path d="M0 0l24 24" stroke="currentColor" fill="none" />\`;
</script>
<template><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" :viewBox="viewBox" v-html="content" /></template>
`
		);
		expect(result.assets).toHaveLength(1);
		expect(result.assets[0].filename).toBe('i/icon.d.ts');
		expect(result.style).toBeUndefined();

		// Check types
		expect(result.assets[0].content)
			.toBe(`import { DefineSetupFnComponent, PublicProps } from 'vue';

interface IconProps {
	square?: boolean;
}

declare const Component: DefineSetupFnComponent<IconProps, {}, {}, IconProps & {}, PublicProps>;

export { type IconProps };
export default Component;
`);
	});

	it('Square property with square viewBox', () => {
		const context = createUniqueHashContext();
		const options = componentFactoryFileSystemOptions({});
		const data: FactoryIconData = {
			prefix: 'test',
			name: 'icon',
			viewBox: {
				width: 24,
				height: 24,
			},
			icon: {
				content:
					'<path d="M0 0l24 24" stroke="currentColor" fill="none" />',
			},
		};
		const result = createVueComponent(data, {
			context,
			...options,
			cssMode: 'import',
			square: true,
		});
		// console.log(result.content);
		expect(result.content).toBe(
			`<script setup>
import { computed } from 'vue';
import { getSizeProps } from '../helpers/size.js';

const props = defineProps(["width","height","square"]);

const viewBox = '0 0 24 24';
const size = computed(() => getSizeProps(props.width, props.height, 1));
const content = \`<path d="M0 0l24 24" stroke="currentColor" fill="none" />\`;
</script>
<template><svg xmlns="http://www.w3.org/2000/svg" v-bind="size" :viewBox="viewBox" v-html="content" /></template>
`
		);
		expect(result.assets).toHaveLength(2);
		expect(result.assets[0].filename).toBe('helpers/size.js');
		expect(result.assets[1].filename).toBe('i/icon.d.ts');
		expect(result.style).toBeUndefined();

		// Check types
		expect(result.assets[1].content)
			.toBe(`import { DefineSetupFnComponent, PublicProps } from 'vue';

interface IconProps {
	width?: string;
	height?: string;
	square?: boolean;
}

declare const Component: DefineSetupFnComponent<IconProps, {}, {}, IconProps & {}, PublicProps>;

export { type IconProps };
export default Component;
`);
	});

	it('Merged CSS file', () => {
		const context = createUniqueHashContext();
		const options = componentFactoryFileSystemOptions({
			doubleDirsForCSS: false,
			doubleDirsForComponents: false,
		});

		// Convert IconifyIcon and test it
		const data = convertIconifyIconToFactoryContent(
			{
				body: '<path d="M0 0l16 16" fill="currentColor" /><path d="M16 0l-16 16" fill="currentColor" />',
			},
			'test-prefix',
			'line-icon',
			{ context, fallback: false }
		);
		expect(data.prefix).toBe('test-prefix');
		expect(data.name).toBe('line-icon');
		expect(data.viewBox).toEqual({
			left: 0,
			top: 0,
			width: 16,
			height: 16,
		});
		expect(data.fallback).toBeUndefined();

		// Get class name
		const classNames = Object.keys(data.icon.classes ?? {});
		expect(classNames).toHaveLength(2);
		const [testClassName, testClassName2] = classNames;

		// Generate component
		const result = createVueComponent(data, {
			context,
			...options,
			cssMode: 'import',
			height: '1em',
			mergeCSS: getGeneratedAssetFilename('icon.css', options.rootPath),
		});

		// console.log(result.content);
		expect(result.content).toBe(
			`<script setup>
import './icon.css';

const viewBox = '0 0 16 16';
const content = \`<path class="${testClassName}"/><path class="${testClassName2}"/>\`;
</script>
<template><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" :viewBox="viewBox" v-html="content" /></template>
`
		);
		expect(result.assets).toHaveLength(2);
		expect(result.assets[0].filename).toBe(`icon.css`);
		expect(result.assets[1].filename).toBe('line-icon.d.ts');
		expect(result.style).toBeUndefined();
	});

	it('CSS in component', () => {
		const context = createUniqueHashContext();
		const options = componentFactoryFileSystemOptions({
			doubleDirsForCSS: false,
			doubleDirsForComponents: false,
		});

		// Convert IconifyIcon and test it
		const data = convertIconifyIconToFactoryContent(
			{
				body: '<path d="M0 0l16 16" fill="currentColor" /><path d="M16 0l-16 16" fill="currentColor" />',
			},
			'test-prefix',
			'line-icon',
			{ context, fallback: false }
		);
		expect(data.prefix).toBe('test-prefix');
		expect(data.name).toBe('line-icon');
		expect(data.viewBox).toEqual({
			left: 0,
			top: 0,
			width: 16,
			height: 16,
		});
		expect(data.fallback).toBeUndefined();

		// Get class name
		const classNames = Object.keys(data.icon.classes ?? {});
		expect(classNames).toHaveLength(2);
		const [testClassName, testClassName2] = classNames;

		// Generate component
		const result = createVueComponent(data, {
			context,
			...options,
			cssMode: 'embed',
			width: '1em',
			height: '1em',
		});

		// console.log(result.content);
		expect(result.content).toBe(
			`<script setup>

const viewBox = '0 0 16 16';
const content = \`<path class="${testClassName}"/><path class="${testClassName2}"/>\`;
</script>
<template><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" :viewBox="viewBox" v-html="content" /></template>
<style>
.${testClassName2} {
  d: path("M16 0l-16 16");
  fill: currentColor;
}

.${testClassName} {
  d: path("M0 0l16 16");
  fill: currentColor;
}

</style>
`
		);
		expect(result.assets).toHaveLength(1);
		expect(result.assets[0].filename).toBe('line-icon.d.ts');
		expect(result.style).toBeUndefined();
	});
});
