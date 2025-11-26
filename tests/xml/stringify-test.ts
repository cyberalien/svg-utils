import { parseXMLContent } from '../../src/xml/parse.js';
import { stringifyXMLContent } from '../../src/xml/stringify.js';

describe('Testing converting XML content back to string', () => {
	it('Basic tag', () => {
		// Self closing tag
		expect(
			stringifyXMLContent(parseXMLContent('<path d="M0 0"></path>')!)
		).toEqual('<path d="M0 0"/>');

		// Disabled self closing tag
		expect(
			stringifyXMLContent(parseXMLContent('<path d="M0 0"></path>')!, {
				useSelfClosing: false,
			})
		).toEqual('<path d="M0 0"></path>');

		// Pretty print
		expect(
			stringifyXMLContent(parseXMLContent('<path d="M0 0"></path>')!, {
				useSelfClosing: false,
				prettyPrint: true,
			})
		).toEqual('<path d="M0 0"></path>\n');

		// Pretty print with self closing
		expect(
			stringifyXMLContent(parseXMLContent('<path d="M0 0"></path>')!, {
				useSelfClosing: true,
				prettyPrint: true,
			})
		).toEqual('<path d="M0 0" />\n');
	});

	it('Nested tag', () => {
		expect(
			stringifyXMLContent(
				parseXMLContent(
					'<g fill="none"><path stroke="currentColor" fill="initial" /><circle stroke="currentcolor" fill="inherit" /></g>'
				)!
			)
		).toEqual(
			'<g fill="none"><path stroke="currentColor" fill="initial"/><circle stroke="currentcolor" fill="inherit"/></g>'
		);

		// Pretty print
		expect(
			stringifyXMLContent(
				parseXMLContent(
					'<g fill="none"><path stroke="currentColor" fill="initial" /><circle stroke="currentcolor" fill="inherit" /></g>'
				)!,
				{
					prettyPrint: true,
				}
			)
		).toEqual(
			'<g fill="none">\n\t<path stroke="currentColor" fill="initial" />\n\t<circle stroke="currentcolor" fill="inherit" />\n</g>\n'
		);
	});

	it('Text node', () => {
		// Style
		expect(
			stringifyXMLContent(
				parseXMLContent(
					'<style>.cls-1{fill:#fff;opacity:0;}.cls-2{fill:#231f20;}</style>'
				)!
			)
		).toEqual(
			'<style>.cls-1{fill:#fff;opacity:0;}.cls-2{fill:#231f20;}</style>'
		);

		// Style only as children
		expect(
			stringifyXMLContent([
				{
					type: 'text',
					content:
						'.cls-1{fill:#fff;opacity:0;}.cls-2{fill:#231f20;}',
				},
			])
		).toEqual('.cls-1{fill:#fff;opacity:0;}.cls-2{fill:#231f20;}');
	});
});
