import { convertSVGPropertyToCSS } from '../../src/svg-css/props/prop.js';

describe('Converting SVG tag props to CSS', () => {
	it('Path', () => {
		expect(convertSVGPropertyToCSS('path', 'd', 'M0 0h10')).toEqual([
			'd',
			'path("M0 0h10")',
		]);
	});

	it('Numbers', () => {
		expect(convertSVGPropertyToCSS('rect', 'x', 10)).toEqual(['x', '10px']);
		expect(convertSVGPropertyToCSS('rect', 'x', '10')).toEqual([
			'x',
			'10px',
		]);
		expect(convertSVGPropertyToCSS('rect', 'x', '1em')).toEqual([
			'x',
			'1em',
		]);
	});

	it('Stroke and fill', () => {
		expect(convertSVGPropertyToCSS('g', 'stroke', 'currentColor')).toEqual([
			'stroke',
			'currentColor',
		]);
		expect(convertSVGPropertyToCSS('g', 'fill', 'none')).toEqual([
			'fill',
			'none',
		]);
		expect(convertSVGPropertyToCSS('g', 'fill-rule', 'nonzero')).toEqual([
			'fill-rule',
			'nonzero',
		]);
		expect(convertSVGPropertyToCSS('g', 'fill-opacity', 0)).toEqual([
			'fill-opacity',
			'0',
		]);
		expect(convertSVGPropertyToCSS('g', 'opacity', 0.5)).toEqual([
			'opacity',
			'0.5',
		]);
		expect(convertSVGPropertyToCSS('g', 'stroke-linecap', 'round')).toEqual(
			['stroke-linecap', 'round']
		);
	});

	it('Unsupported properties', () => {
		expect(convertSVGPropertyToCSS('g', 'stroke', 'currentColor')).toEqual([
			'stroke',
			'currentColor',
		]);
	});
});
