import type { ParsedXMLTagElement } from '../../src/index.js';
import { extractSVGTagPropertiesForCSS } from '../../src/svg-css/props/props.js';

describe('Converting SVG tag to CSS', () => {
	it('Path', () => {
		const tag: ParsedXMLTagElement = {
			type: 'tag',
			tag: 'path',
			attribs: {
				'd': 'M0 0h10',
				'fill': 'none',
				'stroke': 'black',
				'stroke-width': 2,
				// Keep class
				'class': 'test',
			},
			children: [],
		};
		const extracted = extractSVGTagPropertiesForCSS(tag);
		expect(tag).toEqual({
			type: 'tag',
			tag: 'path',
			attribs: {
				class: 'test',
			},
			children: [],
		});
		expect(extracted).toEqual({
			props: ['d', 'fill', 'stroke', 'stroke-width'],
			rules: {
				'd': 'path("M0 0h10")',
				'fill': 'none',
				'stroke': 'black',
				'stroke-width': '2px',
			},
		});
	});

	it('No valid properties', () => {
		const tag: ParsedXMLTagElement = {
			type: 'tag',
			tag: 'g',
			attribs: {
				style: 'fill: red;',
			},
			children: [],
		};
		const extracted = extractSVGTagPropertiesForCSS(tag);
		expect(tag).toEqual({
			type: 'tag',
			tag: 'g',
			attribs: {
				style: 'fill: red;',
			},
			children: [],
		});
		expect(extracted).toBeUndefined();
	});

	it('Path, legacy mode', () => {
		const tag: ParsedXMLTagElement = {
			type: 'tag',
			tag: 'path',
			attribs: {
				d: 'M0 0h10',
				fill: 'none',
			},
			children: [],
		};
		const extracted = extractSVGTagPropertiesForCSS(tag, true);
		expect(tag).toEqual({
			type: 'tag',
			tag: 'path',
			attribs: {
				d: 'M0 0h10',
			},
			children: [],
		});
		expect(extracted).toEqual({
			props: ['fill'],
			rules: {
				fill: 'none',
			},
		});
	});
});
