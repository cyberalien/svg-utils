import { convertIconifyIconToFactoryContent } from '../../src/components/prepare/iconify.js';
import { createVueFunctionalComponent } from '../../src/components/vue-func.js';
import { generateCSSDefaultImportName } from '../../src/components/helpers/css/name.js';
import { componentFactoryFileSystemOptions } from '../../src/components/prepare/options.js';
import type { FactoryIconData } from '../../src/components/types/data.js';

describe('Creating Vue functional components', () => {
	it('Simple icon', () => {
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
		const result = createVueFunctionalComponent(data, {
			...options,
			cssMode: 'import',
		});
		// console.log(result.content);
		expect(result.content).toBe(
			`import { computed, defineComponent, h } from 'vue';
import { getSizeProps } from '../helpers/size.js';

const Component = defineComponent(
	(props) => {
		const viewBox = '0 0 24 24';
		const size = computed(() => getSizeProps(props.width, props.height, 1));
		return () => h('svg', { 
			"xmlns": "http://www.w3.org/2000/svg",
			...size.value,
			viewBox,
			"innerHTML": \`<path d="M0 0l24 24" stroke="currentColor" fill="none" />\`,
		});
	},
	{
		props: ["width","height"]
	}
);

export default Component;
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
			{ fallback: false }
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
		const result = createVueFunctionalComponent(data, {
			...options,
			cssMode: 'import',
			height: '1em',
		});

		// console.log(result.content);
		expect(result.content).toBe(
			`import { defineComponent, h } from 'vue';
import './css/${testClassName}.css';

const Component = defineComponent(
	() => {
		const viewBox = '0 0 16 16';
		return () => h('svg', { 
			"xmlns": "http://www.w3.org/2000/svg",
			"width": "1em",
			"height": "1em",
			viewBox,
			"innerHTML": \`<path class="${testClassName}" />\`,
		});
	},
	{
		props: []
	}
);

export default Component;
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

	it('Icon with CSS, using modules', () => {
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
		const testImportName = generateCSSDefaultImportName(testClassName);

		// Generate component
		const result = createVueFunctionalComponent(data, {
			...options,
			cssMode: 'module',
		});

		// console.log(result.content);
		expect(result.content).toBe(
			`import { computed, defineComponent, h } from 'vue';
import { getSizeProps } from './helpers/size.js';
import ${testImportName} from './css/${testClassName}.module.css';

const Component = defineComponent(
	(props) => {
		const viewBox = '0 0 16 16';
		const size = computed(() => getSizeProps(props.width, props.height, 1));
		return () => h('svg', { 
			"xmlns": "http://www.w3.org/2000/svg",
			...size.value,
			viewBox,
			"innerHTML": \`<path class="\${${testImportName}['${testClassName}']}" />\`,
		});
	},
	{
		props: ["width","height"]
	}
);

export default Component;
`
		);
		expect(result.assets).toHaveLength(3);
		expect(result.assets[0].filename).toBe(
			`css/${testClassName}.module.css`
		);
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

	it('Icon with CSS, separate css file', () => {
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
		const result = createVueFunctionalComponent(data, {
			...options,
			cssMode: 'prop',
		});

		// console.log(result.content);
		expect(result.content).toBe(
			`import { computed, defineComponent, h } from 'vue';
import { getSizeProps } from './helpers/size.js';

const Component = defineComponent(
	(props) => {
		const viewBox = '0 0 16 16';
		const size = computed(() => getSizeProps(props.width, props.height, 1));
		return () => h('svg', { 
			"xmlns": "http://www.w3.org/2000/svg",
			...size.value,
			viewBox,
			"innerHTML": \`<path class="${testClassName}" />\`,
		});
	},
	{
		props: ["width","height"]
	}
);

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

	it('Square property, CSS modules', () => {
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
		const result = createVueFunctionalComponent(data, {
			...options,
			cssMode: 'module', // Makes no difference
			square: true,
		});
		// console.log(result.content);
		expect(result.content).toBe(
			`import { computed, defineComponent, h } from 'vue';
import { getSizeProps } from '../helpers/size.js';

const Component = defineComponent(
	(props) => {
		const baseViewBox = '0 0 20 24';
		const squareViewBox = '-2 0 24 24';
		const viewBox = computed(() => props.square ? squareViewBox : baseViewBox);
		const ratio = computed(() => props.square ? 1 : 0.84);
		const size = computed(() => getSizeProps(props.width, props.height, ratio.value));
		return () => h('svg', { 
			"xmlns": "http://www.w3.org/2000/svg",
			...size.value,
			viewBox: viewBox.value,
			"innerHTML": \`<path d="M0 0l20 24" stroke="currentColor" fill="none" />\`,
		});
	},
	{
		props: ["width","height","square"]
	}
);

export default Component;
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
		const result = createVueFunctionalComponent(data, {
			...options,
			cssMode: 'import',
			square: true,
			width: '1em',
			height: '1em',
		});
		// console.log(result.content);
		expect(result.content).toBe(
			`import { defineComponent, h } from 'vue';

const Component = defineComponent(
	(props) => {
		const viewBox = '0 0 24 24';
		return () => h('svg', { 
			"xmlns": "http://www.w3.org/2000/svg",
			"width": "1em",
			"height": "1em",
			viewBox,
			"innerHTML": \`<path d="M0 0l24 24" stroke="currentColor" fill="none" />\`,
		});
	},
	{
		props: ["square"]
	}
);

export default Component;
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
		const result = createVueFunctionalComponent(data, {
			...options,
			cssMode: 'import',
			square: true,
		});
		// console.log(result.content);
		expect(result.content).toBe(
			`import { computed, defineComponent, h } from 'vue';
import { getSizeProps } from '../helpers/size.js';

const Component = defineComponent(
	(props) => {
		const viewBox = '0 0 24 24';
		const size = computed(() => getSizeProps(props.width, props.height, 1));
		return () => h('svg', { 
			"xmlns": "http://www.w3.org/2000/svg",
			...size.value,
			viewBox,
			"innerHTML": \`<path d="M0 0l24 24" stroke="currentColor" fill="none" />\`,
		});
	},
	{
		props: ["width","height","square"]
	}
);

export default Component;
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
});
