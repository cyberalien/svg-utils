import { convertIconifyIconToFactoryContent } from '../../src/components/prepare/iconify.js';
import { createSvelteComponent } from '../../src/components/svelte.js';
import { componentFactoryFileSystemOptions } from '../../src/components/prepare/options.js';
import type { FactoryIconData } from '../../src/components/types/data.js';
import { getGeneratedAssetFilename } from '../../src/components/helpers/filenames/asset.js';
import { createUniqueHashContext } from '../../src/helpers/hash/context.js';

describe('Creating Svelte components', () => {
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
		const result = createSvelteComponent(data, {
			context,
			...options,
			cssMode: 'import',
		});
		// console.log(result.content);
		expect(result.content).toBe(
			`<script>
import { getSizeProps } from '../helpers/size.js';

let {width, height, ...props} = $props();

const viewBox = '0 0 24 24';
let size = $derived(getSizeProps(width, height, 1));
const content = \`<path d="M0 0l24 24" stroke="currentColor" fill="none" />\`;
</script>
<svg xmlns="http://www.w3.org/2000/svg" {...size} viewBox={viewBox} {...props}>{@html content}</svg>
`
		);
		expect(result.assets).toHaveLength(2);
		expect(result.assets[0].filename).toBe('helpers/size.js');
		expect(result.assets[1].filename).toBe('i/icon.d.ts');
		expect(result.style).toBeUndefined();

		// Check types
		expect(result.assets[1].content)
			.toBe(`import { SvelteComponent } from "svelte";
import { SvelteHTMLElements } from "svelte/elements";

interface IconProps {
	width?: string;
	height?: string;
}

declare class Component extends SvelteComponent<Omit<SvelteHTMLElements['svg'], 'viewBox' | 'width' | 'height' | 'xmlns'> & IconProps & Record<\`data-\${string}\`, string>> {}

export { type IconProps };
export default Component;
`);
	});

	it('Simple icon with fallback', () => {
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
					'<path d="M0 0l24 24" stroke="currentColor" fill="none"/>',
			},
			fallback: 'test:icon',
		};
		const result = createSvelteComponent(data, {
			context,
			...options,
			cssMode: 'import',
		});
		// console.log(result.content);
		expect(result.content).toBe(
			`<script>
import Icon from '@iconify/css-svelte';

let {width, height, ...props} = $props();

const viewBox = {"width":24,"height":24};
const content = \`<path d="M0 0l24 24" stroke="currentColor" fill="none"/>\`;
</script>
<Icon width={width} height={height} viewBox={viewBox} content={content} fallback="test:icon" {...props}></Icon>
`
		);
		expect(result.assets).toHaveLength(1);
		expect(result.assets[0].filename).toBe('i/icon.d.ts');
		expect(result.style).toBeUndefined();

		// Check types
		expect(result.assets[0].content)
			.toBe(`import { SvelteComponent } from "svelte";
import { SvelteHTMLElements } from "svelte/elements";

interface IconProps {
	width?: string;
	height?: string;
}

declare class Component extends SvelteComponent<Omit<SvelteHTMLElements['svg'], 'viewBox' | 'width' | 'height' | 'xmlns'> & IconProps & Record<\`data-\${string}\`, string>> {}

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
		const result = createSvelteComponent(data, {
			context,
			...options,
			cssMode: 'import',
			height: '1em',
		});

		// console.log(result.content);
		expect(result.content).toBe(
			`<script>
import './css/${testClassName}.css';

let props = $props();

const viewBox = '0 0 16 16';
const content = \`<path class="${testClassName}"/>\`;
</script>
<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox={viewBox} {...props}>{@html content}</svg>
`
		);
		expect(result.assets).toHaveLength(2);
		expect(result.assets[0].filename).toBe(`css/${testClassName}.css`);
		expect(result.assets[1].filename).toBe('line-icon.d.ts');
		expect(result.style).toBeUndefined();

		// Check types
		expect(result.assets[1].content)
			.toBe(`import { SvelteComponent } from "svelte";
import { SvelteHTMLElements } from "svelte/elements";

interface IconProps {

}

declare class Component extends SvelteComponent<Omit<SvelteHTMLElements['svg'], 'viewBox' | 'width' | 'height' | 'xmlns'> & IconProps & Record<\`data-\${string}\`, string>> {}

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
		const result = createSvelteComponent(data, {
			context,
			...options,
			cssMode: 'import',
			ts: true,
		});

		// console.log(result.content);
		expect(result.content).toBe(
			`<script lang="ts">
import { getSizeProps } from './helpers/size.js';
import './css/${testClassName}.css';

interface Props {
\twidth?: string;
\theight?: string;
};

let {width, height, ...props}: Props = $props();

const viewBox = '0 0 16 16';
let size = $derived(getSizeProps(width, height, 1));
const content = \`<path class="${testClassName}"/>\`;
</script>
<svg xmlns="http://www.w3.org/2000/svg" {...size} viewBox={viewBox} {...props}>{@html content}</svg>
`
		);
		expect(result.assets).toHaveLength(3);
		expect(result.assets[0].filename).toBe(`css/${testClassName}.css`);
		expect(result.assets[1].filename).toBe('helpers/size.js');
		expect(result.assets[2].filename).toBe('line-icon.d.ts');
		expect(result.style).toBeUndefined();

		// Check types
		expect(result.assets[2].content)
			.toBe(`import { SvelteComponent } from "svelte";
import { SvelteHTMLElements } from "svelte/elements";

interface IconProps {
	width?: string;
	height?: string;
}

declare class Component extends SvelteComponent<Omit<SvelteHTMLElements['svg'], 'viewBox' | 'width' | 'height' | 'xmlns'> & IconProps & Record<\`data-\${string}\`, string>> {}

export { type IconProps };
export default Component;
`);
	});

	it('Icon with CSS, using separate file', () => {
		const context = createUniqueHashContext();
		const options = componentFactoryFileSystemOptions({
			doubleDirsForCSS: false, // Ignored
			doubleDirsForComponents: true, // Used for CSS
			prefixDirsForComponents: true, // Used for CSS
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
		const result = createSvelteComponent(data, {
			context,
			...options,
			cssMode: 'prop',
		});

		// console.log(result.content);
		expect(result.content).toBe(
			`<script>
import { getSizeProps } from '../../helpers/size.js';

let {width, height, ...props} = $props();

const viewBox = '0 0 16 16';
let size = $derived(getSizeProps(width, height, 1));
const content = \`<path class="${testClassName}"/>\`;
</script>
<svg xmlns="http://www.w3.org/2000/svg" {...size} viewBox={viewBox} {...props}>{@html content}</svg>
`
		);
		expect(result.assets).toHaveLength(2);
		expect(result.assets[0].filename).toBe('helpers/size.js');
		expect(result.assets[1].filename).toBe(
			`${prefix}/${name.slice(0, 1)}/${name}.d.ts`
		);

		// Check CSS
		expect(result.style).toBe(
			`.${testClassName} {\n  d: path("M0 0l16 16");\n  fill: currentColor;\n}\n`
		);

		// Check types
		expect(result.assets[1].content)
			.toBe(`import { SvelteComponent } from "svelte";
import { SvelteHTMLElements } from "svelte/elements";

interface IconProps {
	width?: string;
	height?: string;
}

declare class Component extends SvelteComponent<Omit<SvelteHTMLElements['svg'], 'viewBox' | 'width' | 'height' | 'xmlns'> & IconProps & Record<\`data-\${string}\`, string>> {}

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
		const result = createSvelteComponent(data, {
			context,
			...options,
			cssMode: 'import',
			square: true,
		});
		// console.log(result.content);
		expect(result.content).toBe(
			`<script>
import { getSizeProps } from '../helpers/size.js';

let {width, height, square, ...props} = $props();

const baseViewBox = '0 0 20 24';
const squareViewBox = '-2 0 24 24';
let viewBoxComputed = $derived(square ? squareViewBox : baseViewBox);
let ratio = $derived(square ? 1 : 0.84);
let size = $derived(getSizeProps(width, height, ratio));
const content = \`<path d="M0 0l20 24" stroke="currentColor" fill="none" />\`;
</script>
<svg xmlns="http://www.w3.org/2000/svg" {...size} viewBox={viewBoxComputed} {...props}>{@html content}</svg>
`
		);
		expect(result.assets).toHaveLength(2);
		expect(result.assets[0].filename).toBe('helpers/size.js');
		expect(result.assets[1].filename).toBe('i/icon.d.ts');
		expect(result.style).toBeUndefined();

		// Check types
		expect(result.assets[1].content)
			.toBe(`import { SvelteComponent } from "svelte";
import { SvelteHTMLElements } from "svelte/elements";

interface IconProps {
	width?: string;
	height?: string;
	square?: boolean;
}

declare class Component extends SvelteComponent<Omit<SvelteHTMLElements['svg'], 'viewBox' | 'width' | 'height' | 'xmlns'> & IconProps & Record<\`data-\${string}\`, string>> {}

export { type IconProps };
export default Component;
`);
	});

	it('Square property, fallback', () => {
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
			fallback: 'test:icon',
		};
		const result = createSvelteComponent(data, {
			context,
			...options,
			cssMode: 'import',
			square: true,
		});
		// console.log(result.content);
		expect(result.content).toBe(
			`<script>
import Icon from '@iconify/css-svelte';

let {width, height, square, ...props} = $props();

const baseViewBox = {"width":20,"height":24};
const squareViewBox = {"width":24,"height":24,"left":-2};
let viewBoxComputed = $derived(square ? squareViewBox : baseViewBox);
const content = \`<path d="M0 0l20 24" stroke="currentColor" fill="none" />\`;
</script>
<Icon width={width} height={height} viewBox={viewBoxComputed} content={content} fallback="test:icon" {...props}></Icon>
`
		);
		expect(result.assets).toHaveLength(1);
		expect(result.assets[0].filename).toBe('i/icon.d.ts');
		expect(result.style).toBeUndefined();

		// Check types
		expect(result.assets[0].content)
			.toBe(`import { SvelteComponent } from "svelte";
import { SvelteHTMLElements } from "svelte/elements";

interface IconProps {
	width?: string;
	height?: string;
	square?: boolean;
}

declare class Component extends SvelteComponent<Omit<SvelteHTMLElements['svg'], 'viewBox' | 'width' | 'height' | 'xmlns'> & IconProps & Record<\`data-\${string}\`, string>> {}

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
		const result = createSvelteComponent(data, {
			context,
			...options,
			cssMode: 'import',
			square: true,
			width: '1em',
			height: '1em',
		});
		// console.log(result.content);
		expect(result.content).toBe(
			`<script>

let {square, ...props} = $props();

const viewBox = '0 0 24 24';
const content = \`<path d="M0 0l24 24" stroke="currentColor" fill="none" />\`;
</script>
<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox={viewBox} {...props}>{@html content}</svg>
`
		);
		expect(result.assets).toHaveLength(1);
		expect(result.assets[0].filename).toBe('i/icon.d.ts');
		expect(result.style).toBeUndefined();

		// Check types
		expect(result.assets[0].content)
			.toBe(`import { SvelteComponent } from "svelte";
import { SvelteHTMLElements } from "svelte/elements";

interface IconProps {
	square?: boolean;
}

declare class Component extends SvelteComponent<Omit<SvelteHTMLElements['svg'], 'viewBox' | 'width' | 'height' | 'xmlns'> & IconProps & Record<\`data-\${string}\`, string>> {}

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
		const result = createSvelteComponent(data, {
			context,
			...options,
			cssMode: 'import',
			square: true,
		});
		// console.log(result.content);
		expect(result.content).toBe(
			`<script>
import { getSizeProps } from '../helpers/size.js';

let {width, height, square, ...props} = $props();

const viewBox = '0 0 24 24';
let size = $derived(getSizeProps(width, height, 1));
const content = \`<path d="M0 0l24 24" stroke="currentColor" fill="none" />\`;
</script>
<svg xmlns="http://www.w3.org/2000/svg" {...size} viewBox={viewBox} {...props}>{@html content}</svg>
`
		);
		expect(result.assets).toHaveLength(2);
		expect(result.assets[0].filename).toBe('helpers/size.js');
		expect(result.assets[1].filename).toBe('i/icon.d.ts');
		expect(result.style).toBeUndefined();

		// Check types
		expect(result.assets[1].content)
			.toBe(`import { SvelteComponent } from "svelte";
import { SvelteHTMLElements } from "svelte/elements";

interface IconProps {
	width?: string;
	height?: string;
	square?: boolean;
}

declare class Component extends SvelteComponent<Omit<SvelteHTMLElements['svg'], 'viewBox' | 'width' | 'height' | 'xmlns'> & IconProps & Record<\`data-\${string}\`, string>> {}

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
		const result = createSvelteComponent(data, {
			context,
			...options,
			cssMode: 'import',
			height: '1em',
			mergeCSS: getGeneratedAssetFilename('icon.css', options.rootPath),
		});

		// console.log(result.content);
		expect(result.content).toBe(
			`<script>
import './icon.css';

let props = $props();

const viewBox = '0 0 16 16';
const content = \`<path class="${testClassName}"/><path class="${testClassName2}"/>\`;
</script>
<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox={viewBox} {...props}>{@html content}</svg>
`
		);
		expect(result.assets).toHaveLength(2);
		expect(result.assets[0].filename).toBe(`icon.css`);
		expect(result.assets[1].filename).toBe('line-icon.d.ts');
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
		const result = createSvelteComponent(data, {
			context,
			...options,
			cssMode: 'embed',
			height: '1em',
		});

		// console.log(result.content);
		expect(result.content).toBe(
			`<script>

let props = $props();

const viewBox = '0 0 16 16';
const content = \`<path class="${testClassName}"/><path class="${testClassName2}"/>\`;
</script>
<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox={viewBox} {...props}>{@html content}</svg>
<style>
:global .${testClassName} {
  d: path("M0 0l16 16");
  fill: currentColor;
}

:global .${testClassName2} {
  d: path("M16 0l-16 16");
  fill: currentColor;
}

</style>
`
		);
		expect(result.assets).toHaveLength(1);
		expect(result.assets[0].filename).toBe('line-icon.d.ts');
		expect(result.style).toBeUndefined();
		expect(result.style).toBeUndefined();
	});
});
