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
			},
			children: [],
		};
		const extracted = extractSVGTagPropertiesForCSS(tag);
		expect(tag).toEqual({
			type: 'tag',
			tag: 'path',
			attribs: {
				//
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
});
