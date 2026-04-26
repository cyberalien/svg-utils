import { convertIconifyIconToFactoryContent } from '../../src/components/prepare/iconify.js';
import { createSvelteComponent } from '../../src/components/svelte.js';
import { componentFactoryFileSystemOptions } from '../../src/components/prepare/options.js';
import type { FactoryIconData } from '../../src/components/types/data.js';
import { getGeneratedAssetFilename } from '../../src/components/helpers/filenames/asset.js';
import { createUniqueHashContext } from '../../src/helpers/hash/context.js';
import { stringifyStylesheet } from '../../src/css/stylesheet.js';
import { prepareComponentFactoryStatefulIcon } from '../../src/components/prepare/states.js';

describe('Creating Svelte components', () => {
	it('Simple icon', () => {
		const context = createUniqueHashContext();
		const options = componentFactoryFileSystemOptions({});
		const data: FactoryIconData = {
			prefix: 'test',
			name: 'icon',
			icon: {
				viewBox: {
					width: 24,
					height: 24,
				},
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
import { replaceIDs } from '../helpers/ids.js';

/** @type {{width?: string; height?: string;}} */
let {width: widthProp, height: heightProp, ...props} = $props();

const viewBox = '0 0 24 24';
let size = $derived(getSizeProps(widthProp, heightProp, 1));
const content = replaceIDs(\`<path d="M0 0l24 24" stroke="currentColor" fill="none" />\`);
</script>
<svg xmlns="http://www.w3.org/2000/svg" {...size} viewBox={viewBox} {...props}>{@html content}</svg>
`
		);
		expect(result.assets).toHaveLength(3);
		expect(result.assets[0].filename).toBe('helpers/size.js');
		expect(result.assets[1].filename).toBe('helpers/ids.js');
		expect(result.assets[2].filename).toBe('i/icon.d.ts');
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

	it('Simple icon with fallback', () => {
		const context = createUniqueHashContext();
		const options = componentFactoryFileSystemOptions({});
		const data: FactoryIconData = {
			prefix: 'test',
			name: 'icon',
			icon: {
				viewBox: {
					width: 24,
					height: 24,
				},
				content:
					'<path d="M0 0l24 24" stroke="currentColor" fill="none"/>',
				defaultFallback: 'test:icon',
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
import Icon from '@iconify/css-svelte';

/** @type {{width?: string; height?: string;}} */
let {width: widthProp, height: heightProp, ...props} = $props();

const viewBox = {"width":24,"height":24};
const content = \`<path d="M0 0l24 24" stroke="currentColor" fill="none"/>\`;
</script>
<Icon width={widthProp} height={heightProp} viewBox={viewBox} content={content} fallback="test:icon" {...props}></Icon>
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
		expect(data.icon.viewBox).toEqual({
			left: 0,
			top: 0,
			width: 16,
			height: 16,
		});
		expect(data.icon.defaultFallback).toBeUndefined();

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
import { replaceIDs } from './helpers/ids.js';
import './css/${testClassName}.css';

let props = $props();

const viewBox = '0 0 16 16';
const content = replaceIDs(\`<path class="${testClassName}"/>\`);
</script>
<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox={viewBox} {...props}>{@html content}</svg>
`
		);
		expect(result.assets).toHaveLength(3);
		expect(result.assets[0].filename).toBe(`css/${testClassName}.css`);
		expect(result.assets[1].filename).toBe('helpers/ids.js');
		expect(result.assets[2].filename).toBe('line-icon.d.ts');
		expect(result.style).toBeUndefined();

		// Check types
		expect(result.assets[2].content)
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
		expect(data.icon.viewBox).toEqual({
			left: 0,
			top: 0,
			width: 16,
			height: 16,
		});
		expect(data.icon.defaultFallback).toBeUndefined();

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
import { replaceIDs } from './helpers/ids.js';
import './css/${testClassName}.css';

interface Props {
\twidth?: string;
\theight?: string;
};

let {width: widthProp, height: heightProp, ...props}: Props = $props();

const viewBox = '0 0 16 16';
let size = $derived(getSizeProps(widthProp, heightProp, 1));
const content = replaceIDs(\`<path class="${testClassName}"/>\`);
</script>
<svg xmlns="http://www.w3.org/2000/svg" {...size} viewBox={viewBox} {...props}>{@html content}</svg>
`
		);
		expect(result.assets).toHaveLength(4);
		expect(result.assets[0].filename).toBe(`css/${testClassName}.css`);
		expect(result.assets[1].filename).toBe('helpers/size.js');
		expect(result.assets[2].filename).toBe('helpers/ids.js');
		expect(result.assets[3].filename).toBe('line-icon.d.ts');
		expect(result.style).toBeUndefined();

		// Check types
		expect(result.assets[3].content)
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
		expect(data.icon.viewBox).toEqual({
			left: 0,
			top: 0,
			width: 16,
			height: 16,
		});
		expect(data.icon.defaultFallback).toBeUndefined();

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
import { replaceIDs } from '../../helpers/ids.js';

/** @type {{width?: string; height?: string;}} */
let {width: widthProp, height: heightProp, ...props} = $props();

const viewBox = '0 0 16 16';
let size = $derived(getSizeProps(widthProp, heightProp, 1));
const content = replaceIDs(\`<path class="${testClassName}"/>\`);
</script>
<svg xmlns="http://www.w3.org/2000/svg" {...size} viewBox={viewBox} {...props}>{@html content}</svg>
`
		);
		expect(result.assets).toHaveLength(3);
		expect(result.assets[0].filename).toBe('helpers/size.js');
		expect(result.assets[1].filename).toBe('helpers/ids.js');
		expect(result.assets[2].filename).toBe(
			`${prefix}/${name.slice(0, 1)}/${name}.d.ts`
		);

		// Check CSS
		expect(
			result.style ? stringifyStylesheet(result.style) : undefined
		).toBe(
			`.${testClassName} {\n  d: path("M0 0l16 16");\n  fill: currentColor;\n}\n`
		);

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

	it('Square property', () => {
		const context = createUniqueHashContext();
		const options = componentFactoryFileSystemOptions({});
		const data: FactoryIconData = {
			prefix: 'test',
			name: 'icon',
			icon: {
				viewBox: {
					width: 20,
					height: 24,
				},
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
import { replaceIDs } from '../helpers/ids.js';

/** @type {{width?: string; height?: string; square?: boolean;}} */
let {width: widthProp, height: heightProp, square: squareProp, ...props} = $props();

const baseViewBox = '0 0 20 24';
const squareViewBox = '-2 0 24 24';
let viewBoxComputed = $derived(squareProp ? squareViewBox : baseViewBox);
let ratio = $derived(squareProp ? 1 : 0.84);
let size = $derived(getSizeProps(widthProp, heightProp, ratio));
const content = replaceIDs(\`<path d="M0 0l20 24" stroke="currentColor" fill="none" />\`);
</script>
<svg xmlns="http://www.w3.org/2000/svg" {...size} viewBox={viewBoxComputed} {...props}>{@html content}</svg>
`
		);
		expect(result.assets).toHaveLength(3);
		expect(result.assets[0].filename).toBe('helpers/size.js');
		expect(result.assets[1].filename).toBe('helpers/ids.js');
		expect(result.assets[2].filename).toBe('i/icon.d.ts');
		expect(result.style).toBeUndefined();

		// Check types
		expect(result.assets[2].content)
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
			icon: {
				viewBox: {
					width: 20,
					height: 24,
				},
				content:
					'<path d="M0 0l20 24" stroke="currentColor" fill="none" />',
				defaultFallback: 'test:icon',
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
import Icon from '@iconify/css-svelte';

/** @type {{width?: string; height?: string; square?: boolean;}} */
let {width: widthProp, height: heightProp, square: squareProp, ...props} = $props();

const baseViewBox = {"width":20,"height":24};
const squareViewBox = {"width":24,"height":24,"left":-2};
let viewBoxComputed = $derived(squareProp ? squareViewBox : baseViewBox);
const content = \`<path d="M0 0l20 24" stroke="currentColor" fill="none" />\`;
</script>
<Icon width={widthProp} height={heightProp} viewBox={viewBoxComputed} content={content} fallback="test:icon" {...props}></Icon>
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
			icon: {
				viewBox: {
					width: 24,
					height: 24,
				},
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
import { replaceIDs } from '../helpers/ids.js';

/** @type {{square?: boolean;}} */
let {square: squareProp, ...props} = $props();

const viewBox = '0 0 24 24';
const content = replaceIDs(\`<path d="M0 0l24 24" stroke="currentColor" fill="none" />\`);
</script>
<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox={viewBox} {...props}>{@html content}</svg>
`
		);
		expect(result.assets).toHaveLength(2);
		expect(result.assets[0].filename).toBe('helpers/ids.js');
		expect(result.assets[1].filename).toBe('i/icon.d.ts');
		expect(result.style).toBeUndefined();

		// Check types
		expect(result.assets[1].content)
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
			icon: {
				viewBox: {
					width: 24,
					height: 24,
				},
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
import { replaceIDs } from '../helpers/ids.js';

/** @type {{width?: string; height?: string; square?: boolean;}} */
let {width: widthProp, height: heightProp, square: squareProp, ...props} = $props();

const viewBox = '0 0 24 24';
let size = $derived(getSizeProps(widthProp, heightProp, 1));
const content = replaceIDs(\`<path d="M0 0l24 24" stroke="currentColor" fill="none" />\`);
</script>
<svg xmlns="http://www.w3.org/2000/svg" {...size} viewBox={viewBox} {...props}>{@html content}</svg>
`
		);
		expect(result.assets).toHaveLength(3);
		expect(result.assets[0].filename).toBe('helpers/size.js');
		expect(result.assets[1].filename).toBe('helpers/ids.js');
		expect(result.assets[2].filename).toBe('i/icon.d.ts');
		expect(result.style).toBeUndefined();

		// Check types
		expect(result.assets[2].content)
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
		expect(data.icon.viewBox).toEqual({
			left: 0,
			top: 0,
			width: 16,
			height: 16,
		});
		expect(data.icon.defaultFallback).toBeUndefined();

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
import { replaceIDs } from './helpers/ids.js';
import './icon.css';

let props = $props();

const viewBox = '0 0 16 16';
const content = replaceIDs(\`<path class="${testClassName}"/><path class="${testClassName2}"/>\`);
</script>
<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox={viewBox} {...props}>{@html content}</svg>
`
		);
		expect(result.assets).toHaveLength(3);
		expect(result.assets[0].filename).toBe(`icon.css`);
		expect(result.assets[1].filename).toBe('helpers/ids.js');
		expect(result.assets[2].filename).toBe('line-icon.d.ts');
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
		expect(data.icon.viewBox).toEqual({
			left: 0,
			top: 0,
			width: 16,
			height: 16,
		});
		expect(data.icon.defaultFallback).toBeUndefined();

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
import { replaceIDs } from './helpers/ids.js';

let props = $props();

const viewBox = '0 0 16 16';
const content = replaceIDs(\`<path class="${testClassName}"/><path class="${testClassName2}"/>\`);
</script>
<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox={viewBox} {...props}>{@html content}</svg>
<style>
:global(.${testClassName2}) {
  d: path("M16 0l-16 16");
  fill: currentColor;
}

:global(.${testClassName}) {
  d: path("M0 0l16 16");
  fill: currentColor;
}

</style>
`
		);
		expect(result.assets).toHaveLength(2);
		expect(result.assets[0].filename).toBe('helpers/ids.js');
		expect(result.assets[1].filename).toBe('line-icon.d.ts');
		expect(result.style).toBeUndefined();
		expect(result.style).toBeUndefined();
	});

	it('Stateful icon', () => {
		const context = createUniqueHashContext();
		const options = componentFactoryFileSystemOptions({
			doubleDirsForCSS: false,
			doubleDirsForComponents: false,
		});

		// Convert SVGCSSStatefulIcon
		const icon = prepareComponentFactoryStatefulIcon({
			viewBox: '0 0 22 24',
			content:
				'<path class="fabh7v mfq4_u ona74n"/><path class="ek9rqv mfxbmu ona74n"/>',
			fallback: 'animated-line-24:align-box-{halign}-{valign}',
			states: [
				['halign', ['left', 'center', 'right']],
				['valign', ['top', 'middle', 'bottom', 'stretch']],
				'focus',
			],
			keyframes: {
				'so-from-74': '0%{stroke-dashoffset:74}',
				'so-to-0': '100%{stroke-dashoffset:0}',
			},
			animations: {
				fabh7v: 'stroke-dasharray:74;animation:0.6s linear forwards so-from-74;',
				ek9rqv: 'stroke-dasharray:10;stroke-dashoffset:10;animation:0.2s linear 0.7s forwards so-to-0;',
			},
			classes: {
				ona74n: 'stroke-linecap:round;stroke-linejoin:round;stroke-width:var(--svg-stroke-width, 1.5px);fill:none;',
				mfq4_u: "d:path('M11 3h8c0.5 0 1 0.5 1 1v16c0 0.5 -0.5 1 -1 1h-16c-0.5 0 -1 -0.5 -1 -1v-16c0 -0.5 0.5 -1 1 -1Z');stroke:var(--svg-tertiary-color, currentColor);",
				mfxbmu: "stroke:var(--svg-primary-color, currentColor);d:path('M6 7h4M6 10.5h8M6 14h6');",
			},
			statefulClasses: {
				mfq4_u: {
					stateRules: {
						focus: "d:path('M11 3h9c0 0 0 0 0 0v18c0 0 0 0 0 0h-18c0 0 0 0 0 0v-18c0 0 0 0 0 0Z');",
					},
					transition: 'transition:d 0.4s linear;',
				},
				mfxbmu: {
					stateRules: {
						focus: "d:path('M5 6h8M5 9h8M5 12h8');",
						middle: "d:path('M6 8.5h4M6 12h8M6 15.5h6');",
						middle_focus: "d:path('M5 9h8M5 12h8M5 15h8');",
						bottom: "d:path('M6 10h4M6 13.5h8M6 17h6');",
						bottom_focus: "d:path('M5 12h8M5 15h8M5 18h8');",
						stretch: "d:path('M6 7h4M6 12h8M6 17h6');",
						stretch_focus: "d:path('M5 6h8M5 12h8M5 18h8');",
						center: "d:path('M9 7h4M7 10.5h8M8 14h6');",
						center_focus: "d:path('M7 6h8M7 9h8M7 12h8');",
						center_middle: "d:path('M9 8.5h4M7 12h8M8 15.5h6');",
						center_middle_focus: "d:path('M7 9h8M7 12h8M7 15h8');",
						center_bottom: "d:path('M9 10h4M7 13.5h8M8 17h6');",
						center_bottom_focus: "d:path('M7 12h8M7 15h8M7 18h8');",
						center_stretch: "d:path('M9 7h4M7 12h8M8 17h6');",
						center_stretch_focus: "d:path('M7 6h8M7 12h8M7 18h8');",
						right: "d:path('M12 7h4M8 10.5h8M10 14h6');",
						right_focus: "d:path('M9 6h8M9 9h8M9 12h8');",
						right_middle: "d:path('M12 8.5h4M8 12h8M10 15.5h6');",
						right_middle_focus: "d:path('M9 9h8M9 12h8M9 15h8');",
						right_bottom: "d:path('M12 10h4M8 13.5h8M10 17h6');",
						right_bottom_focus: "d:path('M9 12h8M9 15h8M9 18h8');",
						right_stretch: "d:path('M12 7h4M8 12h8M10 17h6');",
						right_stretch_focus: "d:path('M9 6h8M9 12h8M9 18h8');",
					},
					transition: 'transition:d 0.4s linear;',
				},
			},
		})!;
		expect(icon).toBeTruthy();
		const data: FactoryIconData = {
			prefix: 'test',
			name: 'icon',
			icon,
		};
		expect(data.icon.defaultFallback).toBe(
			'animated-line-24:align-box-left-top'
		);
		expect(data.icon.statefulData!.staticClassname).toBe('state-static');

		// Generate component
		const result = createSvelteComponent(data, {
			context,
			...options,
			cssMode: 'import',
			ts: true,
		});

		// Check template
		expect(result.content).toContain(
			'<Icon class={className} width={widthProp} height={heightProp} viewBox={viewBox} content={content} fallback={fallback} {...props}></Icon>'
		);

		// Make sure static property is included in types
		expect(result.content).toContain(`static?: boolean;`);
	});
});
