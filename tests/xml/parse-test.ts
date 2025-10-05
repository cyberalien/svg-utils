import { parseXMLContent } from '../../src/xml/parse.js';

describe('Testing parsing XML content', () => {
	it('Basic tag', () => {
		// Basic tag
		expect(parseXMLContent('<path d="M0 0"></path>')).toEqual([
			{
				type: 'tag',
				tag: 'path',
				attribs: { d: 'M0 0' },
				children: [],
			},
		]);

		// Basic tag without attributes, self-closing
		expect(parseXMLContent('<defs/>')).toEqual([
			{
				type: 'tag',
				tag: 'defs',
				attribs: {},
				children: [],
			},
		]);
	});

	it('Text content', () => {
		expect(parseXMLContent('<title>Test</title>')).toEqual([
			{
				type: 'tag',
				tag: 'title',
				attribs: {},
				children: [
					{
						type: 'text',
						content: 'Test',
					},
				],
			},
		]);
	});

	it('Nested tags', () => {
		expect(
			parseXMLContent(
				'<g fill="none"><path stroke="currentColor" fill="initial" /><circle stroke="currentcolor" fill="inherit" /></g>'
			)
		).toEqual([
			{
				type: 'tag',
				tag: 'g',
				attribs: { fill: 'none' },
				children: [
					{
						type: 'tag',
						tag: 'path',
						attribs: { stroke: 'currentColor', fill: 'initial' },
						children: [],
					},
					{
						type: 'tag',
						tag: 'circle',
						attribs: { stroke: 'currentcolor', fill: 'inherit' },
						children: [],
					},
				],
			},
		]);
	});
});
