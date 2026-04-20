import { convertSVGPropertyToCSS } from '../../src/svg-css/props/convert.js';
import { defaultSVGCSSPropertyVars } from '../../src/svg-css/props/vars.js';

describe('Converting SVG tag props to CSS', () => {
	it('Path', () => {
		expect(convertSVGPropertyToCSS('path', 'd', 'M0 0h10')).toEqual([
			'd',
			'path("M0 0h10")',
		]);

		// Legacy browsers support
		expect(
			convertSVGPropertyToCSS('path', 'd', 'M0 0h10', {
				legacy: true,
			})
		).toBeUndefined();
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

		// Using variables
		expect(
			convertSVGPropertyToCSS('rect', 'stroke-width', 10, {
				vars: defaultSVGCSSPropertyVars,
			})
		).toEqual(['stroke-width', 'var(--svg-stroke-width--10px, 10px)']);
		expect(
			convertSVGPropertyToCSS('rect', 'stroke-width', 'none', {
				vars: defaultSVGCSSPropertyVars,
			})
		).toEqual(['stroke-width', 'none']);
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

		// Using variables
		expect(
			convertSVGPropertyToCSS('g', 'fill', 'currentColor', {
				vars: defaultSVGCSSPropertyVars,
			})
		).toEqual(['fill', 'var(--svg-color, currentColor)']);
		expect(
			convertSVGPropertyToCSS('g', 'fill', 'none', {
				vars: defaultSVGCSSPropertyVars,
			})
		).toEqual(['fill', 'none']);

		expect(
			convertSVGPropertyToCSS('g', 'fill', '#F00', {
				vars: defaultSVGCSSPropertyVars,
			})
		).toEqual(['fill', 'var(--svg-color--f00, #F00)']);
		expect(
			convertSVGPropertyToCSS('g', 'fill', 'rgb(255, 0, 0)', {
				vars: defaultSVGCSSPropertyVars,
			})
		).toEqual(['fill', 'var(--svg-color--rgb-255-0-0, rgb(255, 0, 0))']);
	});

	it('Unsupported properties', () => {
		expect(convertSVGPropertyToCSS('g', 'stroke', 'currentColor')).toEqual([
			'stroke',
			'currentColor',
		]);
	});
});
