import { getUniqueHash } from '../../src/helpers/hash/unique.js';
import {
	stringifyXMLContent,
	type ParsedXMLTagElement,
} from '../../src/index.js';
import { changeSVGIDs } from '../../src/svg/ids/change.js';
import { removeDuplicateIDs } from '../../src/svg/ids/duplicate.js';
import { removeUnusedIDs } from '../../src/svg/ids/unused.js';
import { parseXMLContent } from '../../src/xml/parse.js';

describe('Replacing IDs in SVG', () => {
	it('Nothing to replace', () => {
		const nodes = parseXMLContent('<path d="M0 0v10" />')!;
		expect(
			changeSVGIDs(nodes, () => {
				throw new Error('Should not be called');
			})
		).toEqual({
			map: {},
			usage: {},
		});
		expect(stringifyXMLContent(nodes)).toBe('<path d="M0 0v10" />');
	});

	it('Simple replacement', () => {
		const nodes = parseXMLContent(
			'<defs><path id="test1" /></defs><use fill="#FFA000" href="#test1"/>'
		)!;
		expect(
			changeSVGIDs(nodes, (id, content, tagName) => {
				if (id !== 'test1' || tagName !== 'path') {
					return `failed: id = ${id}, tagName = ${tagName}`;
				}
				return 'test2';
			})
		).toEqual({
			map: { test2: [nodes[0].children[0]] },
			usage: { test2: [nodes[1]] },
		});
		expect(stringifyXMLContent(nodes)).toBe(
			'<defs><path id="test2" /></defs><use fill="#FFA000" href="#test2" />'
		);
	});

	it('Multiple IDs', () => {
		const nodes = parseXMLContent(
			'<defs><path id="test1" /><path id="test" /></defs><use fill="#FFA000" xlink:href="#test1"/><use fill="#00f" xlink:href="#test"/>'
		)!;
		const ids: string[] = [];
		expect(
			changeSVGIDs(nodes, (id) => {
				ids.push(id);
				return `new-${ids.length}`;
			})
		).toEqual({
			map: {
				'new-1': [nodes[0].children[0]],
				'new-2': [nodes[0].children[1]],
			},
			usage: {
				'new-1': [nodes[1]],
				'new-2': [nodes[2]],
			},
		});
		expect(ids).toEqual(['test1', 'test']);
		expect(stringifyXMLContent(nodes)).toBe(
			'<defs><path id="new-1" /><path id="new-2" /></defs><use fill="#FFA000" xlink:href="#new-1" /><use fill="#00f" xlink:href="#new-2" />'
		);
	});

	it('Nested IDs', () => {
		const nodes = parseXMLContent(
			'<defs><g id="test1"><use fill="#00f" xlink:href="#test"/></g><path id="test" /></defs><use fill="#FFA000" xlink:href="#test1"/>'
		)!;
		const ids: string[] = [];

		expect(
			changeSVGIDs(nodes, (id) => {
				ids.push(id);
				return `new-${ids.length}`;
			})
		).toEqual({
			map: {
				'new-1': [nodes[0].children[1]],
				'new-2': [nodes[0].children[0]],
			},
			usage: {
				'new-1': [
					(nodes[0].children[0] as ParsedXMLTagElement).children[0],
				],
				'new-2': [nodes[1]],
			},
		});

		expect(ids).toEqual(['test', 'test1']); // 'test1' depends on 'test', so 'test' must be replaced first
		expect(stringifyXMLContent(nodes)).toBe(
			'<defs><g id="new-2"><use fill="#00f" xlink:href="#new-1" /></g><path id="new-1" /></defs><use fill="#FFA000" xlink:href="#new-2" />'
		);
	});

	it('Identical elements', () => {
		const nodes = parseXMLContent(
			`<defs>
		<path id="akarIconsPinterestFill0" fill="#fff" d="M0 0h24v24H0z" />
	</defs>
	<g fill="none">
		<g clip-path="url(#akarIconsPinterestFill1)">
			<g clip-path="url(#akarIconsPinterestFill2)">
				<path fill="currentColor" d="M0 12c0 5.123 3.211 9.497 7.73 11.218c-.11-.937-.227-2.482.025-3.566c.217-.932 1.401-5.938 1.401-5.938s-.357-.715-.357-1.774c0-1.66.962-2.9 2.161-2.9c1.02 0 1.512.765 1.512 1.682c0 1.025-.653 2.557-.99 3.978c-.281 1.189.597 2.159 1.769 2.159c2.123 0 3.756-2.239 3.756-5.471c0-2.861-2.056-4.86-4.991-4.86c-3.398 0-5.393 2.549-5.393 5.184c0 1.027.395 2.127.889 2.726a.36.36 0 0 1 .083.343c-.091.378-.293 1.189-.332 1.355c-.053.218-.173.265-.4.159c-1.492-.694-2.424-2.875-2.424-4.627c0-3.769 2.737-7.229 7.892-7.229c4.144 0 7.365 2.953 7.365 6.899c0 4.117-2.595 7.431-6.199 7.431c-1.211 0-2.348-.63-2.738-1.373c0 0-.599 2.282-.744 2.84c-.282 1.084-1.064 2.456-1.549 3.235C9.584 23.815 10.77 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0S0 5.373 0 12" />
			</g>
		</g>
		<defs>
			<clipPath id="akarIconsPinterestFill1">
				<use href="#akarIconsPinterestFill0" />
			</clipPath>
			<clipPath id="akarIconsPinterestFill2">
				<use href="#akarIconsPinterestFill0" />
			</clipPath>
		</defs>
	</g>`
		)!;
		const ids: string[] = [];

		const changeResult = changeSVGIDs(nodes, (id, content) => {
			ids.push(id);
			return `length-${content.length}`;
		});
		expect(changeResult.map).toEqual({
			'length-48': [nodes[0].children[0]],
			'length-56': [
				(nodes[1].children[1] as ParsedXMLTagElement).children[0],
				(nodes[1].children[1] as ParsedXMLTagElement).children[1],
			],
		});

		expect(ids).toEqual([
			'akarIconsPinterestFill0',
			'akarIconsPinterestFill1',
			'akarIconsPinterestFill2',
		]);

		const expected = `<defs>
	<path id="length-48" fill="#fff" d="M0 0h24v24H0z" />
</defs>
<g fill="none">
	<g clip-path="url(#length-56)">
		<g clip-path="url(#length-56)">
			<path fill="currentColor" d="M0 12c0 5.123 3.211 9.497 7.73 11.218c-.11-.937-.227-2.482.025-3.566c.217-.932 1.401-5.938 1.401-5.938s-.357-.715-.357-1.774c0-1.66.962-2.9 2.161-2.9c1.02 0 1.512.765 1.512 1.682c0 1.025-.653 2.557-.99 3.978c-.281 1.189.597 2.159 1.769 2.159c2.123 0 3.756-2.239 3.756-5.471c0-2.861-2.056-4.86-4.991-4.86c-3.398 0-5.393 2.549-5.393 5.184c0 1.027.395 2.127.889 2.726a.36.36 0 0 1 .083.343c-.091.378-.293 1.189-.332 1.355c-.053.218-.173.265-.4.159c-1.492-.694-2.424-2.875-2.424-4.627c0-3.769 2.737-7.229 7.892-7.229c4.144 0 7.365 2.953 7.365 6.899c0 4.117-2.595 7.431-6.199 7.431c-1.211 0-2.348-.63-2.738-1.373c0 0-.599 2.282-.744 2.84c-.282 1.084-1.064 2.456-1.549 3.235C9.584 23.815 10.77 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0S0 5.373 0 12" />
		</g>
	</g>
	<defs>
		<clipPath id="length-56">
			<use href="#length-48" />
		</clipPath>
		<clipPath id="length-56">
			<use href="#length-48" />
		</clipPath>
	</defs>
</g>
`;
		expect(stringifyXMLContent(nodes, { prettyPrint: true })).toBe(
			expected
		);

		// Remove unused IDs (no unused IDs in this test)
		const unusedTest = removeUnusedIDs(nodes, changeResult);
		expect(stringifyXMLContent(unusedTest, { prettyPrint: true })).toBe(
			expected
		);

		// Remove duplicate IDs
		const fixed = removeDuplicateIDs(nodes, changeResult);
		expect(stringifyXMLContent(fixed, { prettyPrint: true })).toBe(
			`<defs>
	<path id="length-48" fill="#fff" d="M0 0h24v24H0z" />
</defs>
<g fill="none">
	<g clip-path="url(#length-56)">
		<g clip-path="url(#length-56)">
			<path fill="currentColor" d="M0 12c0 5.123 3.211 9.497 7.73 11.218c-.11-.937-.227-2.482.025-3.566c.217-.932 1.401-5.938 1.401-5.938s-.357-.715-.357-1.774c0-1.66.962-2.9 2.161-2.9c1.02 0 1.512.765 1.512 1.682c0 1.025-.653 2.557-.99 3.978c-.281 1.189.597 2.159 1.769 2.159c2.123 0 3.756-2.239 3.756-5.471c0-2.861-2.056-4.86-4.991-4.86c-3.398 0-5.393 2.549-5.393 5.184c0 1.027.395 2.127.889 2.726a.36.36 0 0 1 .083.343c-.091.378-.293 1.189-.332 1.355c-.053.218-.173.265-.4.159c-1.492-.694-2.424-2.875-2.424-4.627c0-3.769 2.737-7.229 7.892-7.229c4.144 0 7.365 2.953 7.365 6.899c0 4.117-2.595 7.431-6.199 7.431c-1.211 0-2.348-.63-2.738-1.373c0 0-.599 2.282-.744 2.84c-.282 1.084-1.064 2.456-1.549 3.235C9.584 23.815 10.77 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0S0 5.373 0 12" />
		</g>
	</g>
	<defs>
		<clipPath id="length-56">
			<use href="#length-48" />
		</clipPath>
	</defs>
</g>
`
		);
	});

	it('Animations', () => {
		const nodes = parseXMLContent(
			`<animate id="loop1" attributeName="stroke-dashoffset" values="4;0" begin="0.7s;loop1.begin+6s" dur="0.4s" fill="freeze" />
			<animate id="loop2" attributeName="stroke-dashoffset" values="4;0" begin="1.1s;loop2.begin+6s" dur="0.4s" fill="freeze" />
			<animate id="loop3" attributeName="stroke-dashoffset" values="4;0" begin="2s;loop3.begin+6s;loop2.begin+1s" dur="0.4s" fill="freeze" />
			<animate id="loop4" attributeName="stroke-dashoffset" values="4;0" begin="1.1s;loop1.begin+6s" dur="0.4s" fill="freeze" />`
		)!;

		const hashes = new Set<string>();
		const ids = new Map<string, string>();

		const changeResult = changeSVGIDs(nodes, (id, content) => {
			const hash = getUniqueHash(content, {
				css: false,
				prefix: 'test-',
				length: 8,
			});
			if (hashes.has(hash)) {
				throw new Error(`Hash collision detected: ${hash}`);
			}
			hashes.add(hash);
			ids.set(id, hash);
			return hash;
		});
		expect(changeResult).toEqual({
			map: {
				[ids.get('loop1')!]: [nodes[0]],
				[ids.get('loop2')!]: [nodes[1]],
				[ids.get('loop3')!]: [nodes[2]],
				[ids.get('loop4')!]: [nodes[3]],
			},
			usage: {
				[ids.get('loop1')!]: [nodes[0], nodes[3]],
				[ids.get('loop2')!]: [nodes[1], nodes[2]],
				[ids.get('loop3')!]: [nodes[2]],
				[ids.get('loop4')!]: [],
			},
		});

		const expected =
			`<animate id="${ids.get(
				'loop1'
			)!}" attributeName="stroke-dashoffset" values="4;0" begin="0.7s;${ids.get(
				'loop1'
			)!}.begin+6s" dur="0.4s" fill="freeze" />` +
			`<animate id="${ids.get(
				'loop2'
			)!}" attributeName="stroke-dashoffset" values="4;0" begin="1.1s;${ids.get(
				'loop2'
			)!}.begin+6s" dur="0.4s" fill="freeze" />` +
			`<animate id="${ids.get(
				'loop3'
			)!}" attributeName="stroke-dashoffset" values="4;0" begin="2s;${ids.get(
				'loop3'
			)!}.begin+6s;${ids.get(
				'loop2'
			)!}.begin+1s" dur="0.4s" fill="freeze" />` +
			`<animate id="${ids.get(
				'loop4'
			)!}" attributeName="stroke-dashoffset" values="4;0" begin="1.1s;${ids.get(
				'loop1'
			)!}.begin+6s" dur="0.4s" fill="freeze" />`;
		expect(stringifyXMLContent(nodes)).toBe(expected);

		// Remove unused IDs (id from last animation is not used)
		const unusedTest = removeUnusedIDs(nodes, changeResult);
		expect(stringifyXMLContent(unusedTest)).toBe(
			expected.replace(` id="${ids.get('loop4')!}"`, '')
		);
	});
});
