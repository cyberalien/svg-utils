import { createVueFunctionalComponent } from '../../src/components/vue-func.js';
import { createVueComponent } from '../../src/components/vue.js';
import { componentFactoryFileSystemOptions } from '../../src/components/prepare/options.js';
import type { FactoryIconData } from '../../src/components/types/data.js';

describe('Creating Vue components with fallback', () => {
	it('Functional component', () => {
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
		const result = createVueFunctionalComponent(data, {
			...options,
			cssMode: 'import',
		});
		// console.log(result.content);
		expect(result.content).toBe(
			`import { Icon } from '@iconify/css-vue';
import { defineComponent, h } from 'vue';

const Component = defineComponent(
	(props) => {
		const viewBox = {"width":24,"height":24};
		return () => h(Icon, { 
			width: props.width,
			height: props.height,
			viewBox,
			"content": \`<path d="M0 0l24 24" stroke="currentColor" fill="none" />\`,
			"fallback": "test:icon",
		});
	},
	{
		props: ["width","height"]
	}
);

export default Component;
`
		);
		expect(result.assets).toHaveLength(1);
		expect(result.assets[0].filename).toBe('i/icon.d.ts');

		// Check types
		expect(result.assets[0].content)
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

	it('Vue component', () => {
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
		const result = createVueComponent(data, {
			...options,
			cssMode: 'import',
		});
		// console.log(result.content);
		expect(result.content).toBe(
			`<script setup>
import { Icon } from '@iconify/css-vue';

const props = defineProps(["width","height"]);

const viewBox = {"width":24,"height":24};
const content = \`<path d="M0 0l24 24" stroke="currentColor" fill="none" />\`;
</script>
<template><Icon :width="width" :height="height" :viewBox="viewBox" :content="content" fallback="test:icon" /></template>
`
		);
		expect(result.assets).toHaveLength(1);
		expect(result.assets[0].filename).toBe('i/icon.d.ts');

		// Check types
		expect(result.assets[0].content)
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
});
