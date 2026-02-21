import { addNamedImport } from '../../src/components/helpers/imports/add.js';
import { createFactoryImports } from '../../src/components/helpers/imports/create.js';
import { stringifyFactoryImports } from '../../src/components/helpers/imports/stringify.js';

describe('Imports list', () => {
	it('Stringify imports', () => {
		// Empty
		expect(stringifyFactoryImports(createFactoryImports())).toBe('');

		// Create data
		const data = createFactoryImports();
		data.css.add('../css/one.css');
		data.css.add('~iconify-css/t/two.css');
		data.css.add('iconify-icon/three.css');
		data.default['react'] = 'React';
		data.full.add('iconify-icon');
		data.named['vue'] = new Set(['defineComponent']);
		data.types['vue'] = new Set(['VNode']);
		data.named['empty'] = new Set(); // Should be ignored
		data.types['empty'] = new Set(); // Should be ignored
		addNamedImport(data, 'vue', 'h');

		// Stringify
		expect(stringifyFactoryImports(data)).toBe(`import 'iconify-icon';
import React from 'react';
import { defineComponent, h } from 'vue';
import type { VNode } from 'vue';
import 'iconify-icon/three.css';
import '../css/one.css';
import '~iconify-css/t/two.css';
`);
	});
});
