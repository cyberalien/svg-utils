import { convertIconifyIconToFactoryContent } from '../../src/components/prepare/iconify.js';
import { createJSXComponent } from '../../src/components/jsx.js';
import { componentFactoryFileSystemOptions } from '../../src/components/prepare/options.js';
import type { FactoryIconData } from '../../src/components/types/data.js';
import { createUniqueHashContext } from '../../src/helpers/hash/context.js';

describe('Creating React/Preact components', () => {
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
		const result = createJSXComponent(data, {
			context,
			...options,
			jsx: 'react',
			cssMode: 'import',
		});
		// console.log(result.content);
		expect(result.content).toBe(
			`import { createElement, useMemo } from 'react';
import { getSizeProps } from '../helpers/size.js';

const viewBox = '0 0 24 24';

function Component({width, height, ...props}) {
	const size = useMemo(() => getSizeProps(width, height, 1), [width, height]);
	return createElement('svg', {
		"xmlns": "http://www.w3.org/2000/svg",
		...props,
		...size,
		viewBox,
		dangerouslySetInnerHTML: {__html: \`<path d="M0 0l24 24" stroke="currentColor" fill="none" />\`},
	});
}

export default Component;
`
		);
		expect(result.assets).toHaveLength(2);
		expect(result.assets[0].filename).toBe('helpers/size.js');
		expect(result.assets[1].filename).toBe('i/icon.d.ts');
		expect(result.style).toBeUndefined();

		// Check types
		expect(result.assets[1].content)
			.toBe(`import type { ForwardRefExoticComponent, SVGProps } from 'react';

interface IconProps {
	width?: string;
	height?: string;
}

const Component: ForwardRefExoticComponent<
    Omit<SVGProps<SVGSVGElement>, 'viewBox' | 'width' | 'height' | 'xmlns'> & IconProps
>;

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
		const result = createJSXComponent(data, {
			context,
			...options,
			jsx: 'react',
			cssMode: 'import',
			height: '1em',
		});

		// console.log(result.content);
		expect(result.content).toBe(
			`import { createElement } from 'react';
import './css/${testClassName}.css';

const viewBox = '0 0 16 16';

function Component(props) {
	return createElement('svg', {
		"xmlns": "http://www.w3.org/2000/svg",
		...props,
		"width": "1em",
		"height": "1em",
		viewBox,
		dangerouslySetInnerHTML: {__html: \`<path class="${testClassName}"/>\`},
	});
}

export default Component;
`
		);
		expect(result.assets).toHaveLength(2);
		expect(result.assets[0].filename).toBe(`css/${testClassName}.css`);
		expect(result.assets[1].filename).toBe('line-icon.d.ts');
		expect(result.style).toBeUndefined();

		// Check types
		expect(result.assets[1].content)
			.toBe(`import type { ForwardRefExoticComponent, SVGProps } from 'react';

interface IconProps {

}

const Component: ForwardRefExoticComponent<
    Omit<SVGProps<SVGSVGElement>, 'viewBox' | 'width' | 'height' | 'xmlns'> & IconProps
>;

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
		const result = createJSXComponent(data, {
			context,
			...options,
			jsx: 'react',
			ts: true,
			cssMode: 'import',
		});

		// console.log(result.content);
		expect(result.content).toBe(
			`import { createElement, useMemo } from 'react';
import { getSizeProps } from './helpers/size.js';
import './css/${testClassName}.css';

const viewBox = '0 0 16 16';

function Component<{
\twidth?: string;
\theight?: string;
}>({width, height, ...props}) {
	const size = useMemo(() => getSizeProps(width, height, 1), [width, height]);
	return createElement('svg', {
		"xmlns": "http://www.w3.org/2000/svg",
		...props,
		...size,
		viewBox,
		dangerouslySetInnerHTML: {__html: \`<path class="${testClassName}"/>\`},
	});
}

export default Component;
`
		);
		expect(result.assets).toHaveLength(3);
		expect(result.assets[0].filename).toBe(`css/${testClassName}.css`);
		expect(result.assets[1].filename).toBe('helpers/size.js');
		expect(result.assets[2].filename).toBe('line-icon.d.ts');
		expect(result.style).toBeUndefined();

		// Check types
		expect(result.assets[2].content)
			.toBe(`import type { ForwardRefExoticComponent, SVGProps } from 'react';

interface IconProps {
	width?: string;
	height?: string;
}

const Component: ForwardRefExoticComponent<
    Omit<SVGProps<SVGSVGElement>, 'viewBox' | 'width' | 'height' | 'xmlns'> & IconProps
>;

export { type IconProps };
export default Component;
`);
	});

	it('Icon with CSS, separate css file', () => {
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
		const result = createJSXComponent(data, {
			context,
			...options,
			jsx: 'react',
			cssMode: 'prop',
		});

		// console.log(result.content);
		expect(result.content).toBe(
			`import { createElement, useMemo } from 'react';
import { getSizeProps } from './helpers/size.js';

const viewBox = '0 0 16 16';

function Component({width, height, ...props}) {
	const size = useMemo(() => getSizeProps(width, height, 1), [width, height]);
	return createElement('svg', {
		"xmlns": "http://www.w3.org/2000/svg",
		...props,
		...size,
		viewBox,
		dangerouslySetInnerHTML: {__html: \`<path class="${testClassName}"/>\`},
	});
}

export default Component;
`
		);
		expect(result.assets).toHaveLength(2);
		expect(result.assets[0].filename).toBe('helpers/size.js');
		expect(result.assets[1].filename).toBe('line-icon.d.ts');

		// Check CSS
		expect(result.style).toBe(
			`.${testClassName} {\n  d: path("M0 0l16 16");\n  fill: currentColor;\n}\n`
		);

		// Check types
		expect(result.assets[1].content)
			.toBe(`import type { ForwardRefExoticComponent, SVGProps } from 'react';

interface IconProps {
	width?: string;
	height?: string;
}

const Component: ForwardRefExoticComponent<
    Omit<SVGProps<SVGSVGElement>, 'viewBox' | 'width' | 'height' | 'xmlns'> & IconProps
>;

export { type IconProps };
export default Component;
`);
	});

	it('Icon with CSS, embedded', () => {
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
		const result = createJSXComponent(data, {
			context,
			...options,
			jsx: 'react',
			cssMode: 'embed',
		});

		// console.log(result.content);
		expect(result.content).toBe(
			`import { createElement, useMemo } from 'react';
import { getSizeProps } from './helpers/size.js';

const viewBox = '0 0 16 16';

function Component({width, height, ...props}) {
	const size = useMemo(() => getSizeProps(width, height, 1), [width, height]);
	return createElement('svg', {
		"xmlns": "http://www.w3.org/2000/svg",
		...props,
		...size,
		viewBox,
		dangerouslySetInnerHTML: {__html: \`<style>.${testClassName} {\n  d: path("M0 0l16 16");\n  fill: currentColor;\n}\n</style><path class="${testClassName}"/>\`},
	});
}

export default Component;
`
		);
		expect(result.assets).toHaveLength(2);
		expect(result.assets[0].filename).toBe('helpers/size.js');
		expect(result.assets[1].filename).toBe('line-icon.d.ts');

		// Check CSS
		expect(result.style).toBeUndefined();

		// Check types
		expect(result.assets[1].content)
			.toBe(`import type { ForwardRefExoticComponent, SVGProps } from 'react';

interface IconProps {
	width?: string;
	height?: string;
}

const Component: ForwardRefExoticComponent<
    Omit<SVGProps<SVGSVGElement>, 'viewBox' | 'width' | 'height' | 'xmlns'> & IconProps
>;

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
		const result = createJSXComponent(data, {
			context,
			...options,
			jsx: 'react',
			cssMode: 'import', // Makes no difference
			square: true,
		});
		// console.log(result.content);
		expect(result.content).toBe(
			`import { createElement, useMemo } from 'react';
import { getSizeProps } from '../helpers/size.js';

const baseViewBox = '0 0 20 24';
const squareViewBox = '-2 0 24 24';

function Component({width, height, square, ...props}) {
	const viewBox = useMemo(() => square ? squareViewBox : baseViewBox, [square]);
	const ratio = useMemo(() => square ? 1 : 0.84, [square]);
	const size = useMemo(() => getSizeProps(width, height, ratio), [width, height, ratio]);
	return createElement('svg', {
		"xmlns": "http://www.w3.org/2000/svg",
		...props,
		...size,
		viewBox,
		dangerouslySetInnerHTML: {__html: \`<path d="M0 0l20 24" stroke="currentColor" fill="none" />\`},
	});
}

export default Component;
`
		);
		expect(result.assets).toHaveLength(2);
		expect(result.assets[0].filename).toBe('helpers/size.js');
		expect(result.assets[1].filename).toBe('i/icon.d.ts');
		expect(result.style).toBeUndefined();

		// Check types
		expect(result.assets[1].content)
			.toBe(`import type { ForwardRefExoticComponent, SVGProps } from 'react';

interface IconProps {
	width?: string;
	height?: string;
	square?: boolean;
}

const Component: ForwardRefExoticComponent<
    Omit<SVGProps<SVGSVGElement>, 'viewBox' | 'width' | 'height' | 'xmlns'> & IconProps
>;

export { type IconProps };
export default Component;
`);
	});

	it('Square property with hardcoded size, Preact', () => {
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
		const result = createJSXComponent(data, {
			context,
			...options,
			jsx: 'preact',
			cssMode: 'import',
			square: true,
			width: '1em',
			height: '1em',
		});
		// console.log(result.content);
		expect(result.content).toBe(
			`import { h } from 'preact';

const viewBox = '0 0 24 24';

function Component({square, ...props}) {
	return h('svg', {
		"xmlns": "http://www.w3.org/2000/svg",
		...props,
		"width": "1em",
		"height": "1em",
		viewBox,
		dangerouslySetInnerHTML: {__html: \`<path d="M0 0l24 24" stroke="currentColor" fill="none" />\`},
	});
}

export default Component;
`
		);
		expect(result.assets).toHaveLength(1);
		expect(result.assets[0].filename).toBe('i/icon.d.ts');
		expect(result.style).toBeUndefined();

		// Check types
		expect(result.assets[0].content)
			.toBe(`import type { JSX } from 'preact';

interface IconProps {
	square?: boolean;
}

const Component: (props: Omit<JSX.SVGAttributes<SVGSVGElement>, 'viewBox' | 'width' | 'height' | 'xmlns'> & IconProps) => JSX.Element;

export { type IconProps };
export default Component;
`);
	});

	it('Square property with square viewBox and fallback', () => {
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
			// Ignored because package is missing in options
			fallback: 'test:icon',
		};
		const result = createJSXComponent(data, {
			context,
			...options,
			jsx: 'react',
			cssMode: 'import',
			square: true,
		});
		// console.log(result.content);
		expect(result.content).toBe(
			`import { createElement, useMemo } from 'react';
import { getSizeProps } from '../helpers/size.js';

const viewBox = '0 0 24 24';

function Component({width, height, square, ...props}) {
	const size = useMemo(() => getSizeProps(width, height, 1), [width, height]);
	return createElement('svg', {
		"xmlns": "http://www.w3.org/2000/svg",
		...props,
		...size,
		viewBox,
		dangerouslySetInnerHTML: {__html: \`<path d="M0 0l24 24" stroke="currentColor" fill="none" />\`},
	});
}

export default Component;
`
		);
		expect(result.assets).toHaveLength(2);
		expect(result.assets[0].filename).toBe('helpers/size.js');
		expect(result.assets[1].filename).toBe('i/icon.d.ts');
		expect(result.style).toBeUndefined();

		// Check types
		expect(result.assets[1].content)
			.toBe(`import type { ForwardRefExoticComponent, SVGProps } from 'react';

interface IconProps {
	width?: string;
	height?: string;
	square?: boolean;
}

const Component: ForwardRefExoticComponent<
    Omit<SVGProps<SVGSVGElement>, 'viewBox' | 'width' | 'height' | 'xmlns'> & IconProps
>;

export { type IconProps };
export default Component;
`);
	});

	it('Fallback', () => {
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
			fallback: 'test:icon',
		};
		const result = createJSXComponent(data, {
			context,
			...options,
			jsx: 'react',
			fallbackPackage: '@iconify/css-react',
			cssMode: 'import',
			square: true,
		});
		// console.log(result.content);
		expect(result.content).toBe(
			`import { Icon } from '@iconify/css-react';
import { createElement } from 'react';

const viewBox = {"width":24,"height":24};

function Component({width, height, square, ...props}) {
	return createElement(Icon, {
		...props,
		width,
		height,
		viewBox,
		"content": \`<path d="M0 0l24 24" stroke="currentColor" fill="none" />\`,
		"fallback": "test:icon",
	});
}

export default Component;
`
		);
		expect(result.assets).toHaveLength(1);
		expect(result.assets[0].filename).toBe('i/icon.d.ts');
		expect(result.style).toBeUndefined();

		// Check types
		expect(result.assets[0].content)
			.toBe(`import type { ForwardRefExoticComponent, SVGProps } from 'react';

interface IconProps {
	width?: string;
	height?: string;
	square?: boolean;
}

const Component: ForwardRefExoticComponent<
    Omit<SVGProps<SVGSVGElement>, 'viewBox' | 'width' | 'height' | 'xmlns'> & IconProps
>;

export { type IconProps };
export default Component;
`);
	});
});
