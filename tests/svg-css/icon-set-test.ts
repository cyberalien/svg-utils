import { addIconToSVGCSSIconSet } from '../../src/svg-css/icon-set/add.js';
import { createEmptySVGCSSIconSet } from '../../src/svg-css/icon-set/create.js';
import { getSVGCSSIconFromIconSet } from '../../src/svg-css/icon-set/get.js';
import { expandSVGCSSIconSet } from '../../src/svg-css/icon-set/minify/expand.js';
import { minifySVGCSSIconSet } from '../../src/svg-css/icon-set/minify/minify.js';
import type { SVGCSSIconSet } from '../../src/svg-css/icon-set/types.js';

describe('SVG CSS icon set', () => {
	it('Full cycle', () => {
		// Create icon set
		const iconSet = createEmptySVGCSSIconSet();

		// Add several icons
		addIconToSVGCSSIconSet(iconSet, 'alert', {
			viewBox: '0 0 4 24',
			content:
				'<path class="era5vp rq5r9b"/><path class="rq5r9b vyz4rm"/>',
			fallback: 'animated-line-24:alert',
			states: ['focus'],
			keyframes: {
				'so-from-8': '0%{stroke-dashoffset:8}',
				'fade-to-1': '100%{opacity:1}',
				'transform-267n_q': '0%{transform:translateY(-4px)}',
			},
			classes: {
				era5vp: {
					// Add as object to check that it is minified correctly
					d: "path('M2 8v4')",
				},
				rq5r9b: 'stroke:var(--svg-primary-color, currentColor);stroke-linecap:round;stroke-linejoin:round;stroke-width:var(--svg-stroke-width, 1.5px);fill:none;',
				vyz4rm: "d:path('M2 16v0.01');",
			},
			animations: {
				era5vp: 'stroke-dasharray:8;animation:0.3s linear forwards so-from-8;',
				vyz4rm: 'opacity:0;animation:0s 0.15s forwards fade-to-1, 0.15s linear 0.15s forwards transform-267n_q;',
			},
			statefulClasses: {
				era5vp: {
					stateRules: {
						focus: {
							d: "path('M2 7v6')",
						},
					},
					transition: 'transition:d 0.4s linear;',
				},
				vyz4rm: {
					stateRules: {
						focus: "d:path('M2 17v0.01');",
					},
					transition: 'transition:d 0.4s linear;',
				},
			},
		});
		addIconToSVGCSSIconSet(iconSet, 'alert-circle', {
			viewBox: '0 0 22 24',
			content:
				'<path class="ona74n qqacff"/><path class="a8wtkc cpqkom ona74n"/><path class="a8wtkc mccg4l ona74n"/>',
			fallback: 'animated-line-24:alert-circle',
			states: ['focus'],
			keyframes: {
				'so-to-0': '100%{stroke-dashoffset:0}',
				'so-from-8': '0%{stroke-dashoffset:8}',
				'fade-to-1': '100%{opacity:1}',
				'transform-267n_q': '0%{transform:translateY(-4px)}',
			},
			classes: {
				a8wtkc: 'stroke:var(--svg-primary-color, currentColor);',
				qqacff: "d:path('M11 3h0c4.97 0 9 4.03 9 9v0c0 4.97 -4.03 9 -9 9h0c-4.97 0 -9 -4.03 -9 -9v0c0 -4.97 4.03 -9 9 -9Z');stroke:var(--svg-tertiary-color, currentColor);",
				ona74n: 'stroke-linecap:round;stroke-linejoin:round;stroke-width:var(--svg-stroke-width, 1.5px);fill:none;',
				cpqkom: "d:path('M11 8v4');",
				mccg4l: "d:path('M11 16v0.01');",
			},
			animations: {
				qqacff: 'stroke-dasharray:62;stroke-dashoffset:62;animation:0.6s linear 0.3s forwards so-to-0;',
				cpqkom: 'stroke-dasharray:8;animation:0.3s linear forwards so-from-8;',
				mccg4l: 'opacity:0;animation:0s 0.15s forwards fade-to-1, 0.15s linear 0.15s forwards transform-267n_q;',
			},
			statefulClasses: {
				qqacff: {
					stateRules: {
						focus: "d:path('M11 3h1c4.42 0 8 3.58 8 8v2c0 4.42 -3.58 8 -8 8h-2c-4.42 0 -8 -3.58 -8 -8v-2c0 -4.42 3.58 -8 8 -8Z');",
					},
					transition: 'transition:d 0.4s linear;',
				},
				cpqkom: {
					stateRules: {
						focus: "d:path('M11 7v6');",
					},
					transition: 'transition:d 0.4s linear;',
				},
				mccg4l: {
					stateRules: {
						focus: "d:path('M11 17v0.01');",
					},
					transition: 'transition:d 0.4s linear;',
				},
			},
		});
		addIconToSVGCSSIconSet(iconSet, 'remove-circle', {
			viewBox: '0 0 22 24',
			content:
				'<defs><mask id="SVGD70oWcYx"><path class="iy2otu r1menc s_ydzo"/><path class="al390y ik2mhj r1menc"/></mask></defs><path class="iy2otu r1menc txtv4j"/><path mask="url(#SVGD70oWcYx)" class="bvh1dr"/><path class="a8wtkc ik2mhj iy2otu r1menc"/>',
			fallback: 'animated-line-24:remove-circle',
			states: ['focus'],
			keyframes: {
				'so-from-14': '0%{stroke-dashoffset:14}',
				'so-to-0': '100%{stroke-dashoffset:0}',
			},
			classes: {
				iy2otu: 'stroke-width:var(--svg-stroke-width, 1.5px);',
				a8wtkc: 'stroke:var(--svg-primary-color, currentColor);',
				s_ydzo: "d:path('M14 9l-6 6');stroke:#fff;",
				r1menc: 'stroke-linecap:round;stroke-linejoin:round;fill:none;',
				al390y: 'stroke-width:var(--svg-mask-width, calc(var(--svg-stroke-width, 1.5px) + 1px));stroke:#000;',
				ik2mhj: "d:path('M8 9l6 6');",
				txtv4j: "d:path('M11 3h0c4.97 0 9 4.03 9 9v0c0 4.97 -4.03 9 -9 9h0c-4.97 0 -9 -4.03 -9 -9v0c0 -4.97 4.03 -9 9 -9Z');stroke:var(--svg-tertiary-color, currentColor);",
				bvh1dr: "fill:var(--svg-secondary-color, currentColor);d:path('M0 0h22v24H0z');",
			},
			animations: {
				s_ydzo: 'stroke-dasharray:14;animation:0.2s linear forwards so-from-14;',
				ik2mhj: 'stroke-dasharray:14;stroke-dashoffset:14;animation:0.2s linear 0.2s forwards so-to-0;',
				txtv4j: 'stroke-dasharray:62;stroke-dashoffset:62;animation:0.6s linear 0.5s forwards so-to-0;',
			},
			statefulClasses: {
				s_ydzo: {
					stateRules: {
						focus: "d:path('M15 8l-8 8');",
					},
					transition: 'transition:d 0.4s linear;',
				},
				ik2mhj: {
					stateRules: {
						focus: "d:path('M7 8l8 8');",
					},
					transition: 'transition:d 0.4s linear;',
				},
				txtv4j: {
					stateRules: {
						focus: "d:path('M11 3h1c4.42 0 8 3.58 8 8v2c0 4.42 -3.58 8 -8 8h-2c-4.42 0 -8 -3.58 -8 -8v-2c0 -4.42 3.58 -8 8 -8Z');",
					},
					transition: 'transition:d 0.4s linear;',
				},
			},
		});

		// Check content: not minified
		expect(iconSet.aliases).toBeUndefined();
		expect(iconSet.css).toBeUndefined();
		expect(iconSet.viewBoxes).toBeUndefined();
		expect(iconSet.statesList).toBeUndefined();
		expect(iconSet.fallbackPrefix).toBeUndefined();
		expect(iconSet.icons).toEqual({
			'alert': {
				viewBox: '0 0 4 24',
				content:
					'<path class="era5vp rq5r9b"/><path class="rq5r9b vyz4rm"/>',
				fallback: 'animated-line-24:alert',
				states: ['focus'],
			},
			'alert-circle': {
				viewBox: '0 0 22 24',
				content:
					'<path class="ona74n qqacff"/><path class="a8wtkc cpqkom ona74n"/><path class="a8wtkc mccg4l ona74n"/>',
				fallback: 'animated-line-24:alert-circle',
				states: ['focus'],
			},
			'remove-circle': {
				viewBox: '0 0 22 24',
				content:
					'<defs><mask id="SVGD70oWcYx"><path class="iy2otu r1menc s_ydzo"/><path class="al390y ik2mhj r1menc"/></mask></defs><path class="iy2otu r1menc txtv4j"/><path mask="url(#SVGD70oWcYx)" class="bvh1dr"/><path class="a8wtkc ik2mhj iy2otu r1menc"/>',
				fallback: 'animated-line-24:remove-circle',
				states: ['focus'],
			},
		});
		const originalClasses: SVGCSSIconSet['classes'] = {
			era5vp: {
				r: "d:path('M2 8v4');",
				a: 'stroke-dasharray:8;animation:0.3s linear forwards so-from-8;',
				sr: {
					focus: "d:path('M2 7v6');",
				},
				t: 'transition:d 0.4s linear;',
			},
			rq5r9b: {
				r: 'stroke:var(--svg-primary-color, currentColor);stroke-linecap:round;stroke-linejoin:round;stroke-width:var(--svg-stroke-width, 1.5px);fill:none;',
			},
			vyz4rm: {
				r: "d:path('M2 16v0.01');",
				a: 'opacity:0;animation:0s 0.15s forwards fade-to-1, 0.15s linear 0.15s forwards transform-267n_q;',
				sr: {
					focus: "d:path('M2 17v0.01');",
				},
				t: 'transition:d 0.4s linear;',
			},
			a8wtkc: {
				r: 'stroke:var(--svg-primary-color, currentColor);',
			},
			qqacff: {
				r: "d:path('M11 3h0c4.97 0 9 4.03 9 9v0c0 4.97 -4.03 9 -9 9h0c-4.97 0 -9 -4.03 -9 -9v0c0 -4.97 4.03 -9 9 -9Z');stroke:var(--svg-tertiary-color, currentColor);",
				a: 'stroke-dasharray:62;stroke-dashoffset:62;animation:0.6s linear 0.3s forwards so-to-0;',
				sr: {
					focus: "d:path('M11 3h1c4.42 0 8 3.58 8 8v2c0 4.42 -3.58 8 -8 8h-2c-4.42 0 -8 -3.58 -8 -8v-2c0 -4.42 3.58 -8 8 -8Z');",
				},
				t: 'transition:d 0.4s linear;',
			},
			ona74n: {
				r: 'stroke-linecap:round;stroke-linejoin:round;stroke-width:var(--svg-stroke-width, 1.5px);fill:none;',
			},
			cpqkom: {
				r: "d:path('M11 8v4');",
				a: 'stroke-dasharray:8;animation:0.3s linear forwards so-from-8;',
				sr: {
					focus: "d:path('M11 7v6');",
				},
				t: 'transition:d 0.4s linear;',
			},
			mccg4l: {
				r: "d:path('M11 16v0.01');",
				a: 'opacity:0;animation:0s 0.15s forwards fade-to-1, 0.15s linear 0.15s forwards transform-267n_q;',
				sr: {
					focus: "d:path('M11 17v0.01');",
				},
				t: 'transition:d 0.4s linear;',
			},
			s_ydzo: {
				r: "d:path('M14 9l-6 6');stroke:#fff;",
				a: 'stroke-dasharray:14;animation:0.2s linear forwards so-from-14;',
				sr: {
					focus: "d:path('M15 8l-8 8');",
				},
				t: 'transition:d 0.4s linear;',
			},
			iy2otu: {
				r: 'stroke-width:var(--svg-stroke-width, 1.5px);',
			},
			r1menc: {
				r: 'stroke-linecap:round;stroke-linejoin:round;fill:none;',
			},
			al390y: {
				r: 'stroke-width:var(--svg-mask-width, calc(var(--svg-stroke-width, 1.5px) + 1px));stroke:#000;',
			},
			txtv4j: {
				r: "d:path('M11 3h0c4.97 0 9 4.03 9 9v0c0 4.97 -4.03 9 -9 9h0c-4.97 0 -9 -4.03 -9 -9v0c0 -4.97 4.03 -9 9 -9Z');stroke:var(--svg-tertiary-color, currentColor);",
				a: 'stroke-dasharray:62;stroke-dashoffset:62;animation:0.6s linear 0.5s forwards so-to-0;',
				sr: {
					focus: "d:path('M11 3h1c4.42 0 8 3.58 8 8v2c0 4.42 -3.58 8 -8 8h-2c-4.42 0 -8 -3.58 -8 -8v-2c0 -4.42 3.58 -8 8 -8Z');",
				},
				t: 'transition:d 0.4s linear;',
			},
			bvh1dr: {
				r: "fill:var(--svg-secondary-color, currentColor);d:path('M0 0h22v24H0z');",
			},
			ik2mhj: {
				r: "d:path('M8 9l6 6');",
				a: 'stroke-dasharray:14;stroke-dashoffset:14;animation:0.2s linear 0.2s forwards so-to-0;',
				sr: {
					focus: "d:path('M7 8l8 8');",
				},
				t: 'transition:d 0.4s linear;',
			},
		};
		expect(iconSet.classes).toEqual(originalClasses);
		expect(iconSet.keyframes).toEqual({
			'so-from-8': '0%{stroke-dashoffset:8}',
			'so-from-14': '0%{stroke-dashoffset:14}',
			'so-to-0': '100%{stroke-dashoffset:0}',
			'fade-to-1': '100%{opacity:1}',
			'transform-267n_q': '0%{transform:translateY(-4px)}',
		});

		// Get icon
		expect(getSVGCSSIconFromIconSet(iconSet, 'missing')).toBeUndefined();
		expect(getSVGCSSIconFromIconSet(iconSet, 'alert')).toEqual({
			viewBox: '0 0 4 24',
			content:
				'<path class="era5vp rq5r9b"/><path class="rq5r9b vyz4rm"/>',
			fallback: 'animated-line-24:alert',
			states: ['focus'],
			keyframes: {
				'so-from-8': '0%{stroke-dashoffset:8}',
				'fade-to-1': '100%{opacity:1}',
				'transform-267n_q': '0%{transform:translateY(-4px)}',
			},
			classes: {
				era5vp: "d:path('M2 8v4');",
				rq5r9b: 'stroke:var(--svg-primary-color, currentColor);stroke-linecap:round;stroke-linejoin:round;stroke-width:var(--svg-stroke-width, 1.5px);fill:none;',
				vyz4rm: "d:path('M2 16v0.01');",
			},
			animations: {
				era5vp: 'stroke-dasharray:8;animation:0.3s linear forwards so-from-8;',
				vyz4rm: 'opacity:0;animation:0s 0.15s forwards fade-to-1, 0.15s linear 0.15s forwards transform-267n_q;',
			},
			statefulClasses: {
				era5vp: {
					stateRules: {
						focus: "d:path('M2 7v6');",
					},
					transition: 'transition:d 0.4s linear;',
				},
				vyz4rm: {
					stateRules: {
						focus: "d:path('M2 17v0.01');",
					},
					transition: 'transition:d 0.4s linear;',
				},
			},
		});

		// Minify icon set
		minifySVGCSSIconSet(iconSet);
		expect(iconSet.css).toBeDefined();
		expect(iconSet.fallbackPrefix).toBe('animated-line-24:');

		// Check that "cpqkom" class is minified (used in next test)
		expect(iconSet.classes?.['cpqkom']).toEqual({
			r: "d:path('M11 8v4');",
			a: 0,
			sr: {
				focus: "d:path('M11 7v6');",
			},
			t: 0,
		});

		// Get icon
		expect(iconSet.icons['alert-circle']).toEqual({
			content:
				'<path class="ona74n qqacff"/><path class="a8wtkc cpqkom ona74n"/><path class="a8wtkc mccg4l ona74n"/>',
			fallback: 'alert-circle',
			viewBox: 0,
			states: 0,
		});
		expect(getSVGCSSIconFromIconSet(iconSet, 'alert-circle')).toEqual({
			viewBox: '0 0 22 24',
			content:
				'<path class="ona74n qqacff"/><path class="a8wtkc cpqkom ona74n"/><path class="a8wtkc mccg4l ona74n"/>',
			fallback: 'animated-line-24:alert-circle',
			states: ['focus'],
			keyframes: {
				'so-to-0': '100%{stroke-dashoffset:0}',
				'so-from-8': '0%{stroke-dashoffset:8}',
				'fade-to-1': '100%{opacity:1}',
				'transform-267n_q': '0%{transform:translateY(-4px)}',
			},
			classes: {
				a8wtkc: 'stroke:var(--svg-primary-color, currentColor);',
				qqacff: "d:path('M11 3h0c4.97 0 9 4.03 9 9v0c0 4.97 -4.03 9 -9 9h0c-4.97 0 -9 -4.03 -9 -9v0c0 -4.97 4.03 -9 9 -9Z');stroke:var(--svg-tertiary-color, currentColor);",
				ona74n: 'stroke-linecap:round;stroke-linejoin:round;stroke-width:var(--svg-stroke-width, 1.5px);fill:none;',
				cpqkom: "d:path('M11 8v4');",
				mccg4l: "d:path('M11 16v0.01');",
			},
			animations: {
				qqacff: 'stroke-dasharray:62;stroke-dashoffset:62;animation:0.6s linear 0.3s forwards so-to-0;',
				cpqkom: 'stroke-dasharray:8;animation:0.3s linear forwards so-from-8;',
				mccg4l: 'opacity:0;animation:0s 0.15s forwards fade-to-1, 0.15s linear 0.15s forwards transform-267n_q;',
			},
			statefulClasses: {
				qqacff: {
					stateRules: {
						focus: "d:path('M11 3h1c4.42 0 8 3.58 8 8v2c0 4.42 -3.58 8 -8 8h-2c-4.42 0 -8 -3.58 -8 -8v-2c0 -4.42 3.58 -8 8 -8Z');",
					},
					transition: 'transition:d 0.4s linear;',
				},
				cpqkom: {
					stateRules: {
						focus: "d:path('M11 7v6');",
					},
					transition: 'transition:d 0.4s linear;',
				},
				mccg4l: {
					stateRules: {
						focus: "d:path('M11 17v0.01');",
					},
					transition: 'transition:d 0.4s linear;',
				},
			},
		});

		// Expand icon set
		expandSVGCSSIconSet(iconSet);

		expect(iconSet.aliases).toBeUndefined();
		expect(iconSet.css).toBeUndefined();
		expect(iconSet.viewBoxes).toBeUndefined();
		expect(iconSet.statesList).toBeUndefined();
		expect(iconSet.icons).toEqual({
			'alert': {
				viewBox: '0 0 4 24',
				content:
					'<path class="era5vp rq5r9b"/><path class="rq5r9b vyz4rm"/>',
				fallback: 'animated-line-24:alert',
				states: ['focus'],
			},
			'alert-circle': {
				viewBox: '0 0 22 24',
				content:
					'<path class="ona74n qqacff"/><path class="a8wtkc cpqkom ona74n"/><path class="a8wtkc mccg4l ona74n"/>',
				fallback: 'animated-line-24:alert-circle',
				states: ['focus'],
			},
			'remove-circle': {
				viewBox: '0 0 22 24',
				content:
					'<defs><mask id="SVGD70oWcYx"><path class="iy2otu r1menc s_ydzo"/><path class="al390y ik2mhj r1menc"/></mask></defs><path class="iy2otu r1menc txtv4j"/><path mask="url(#SVGD70oWcYx)" class="bvh1dr"/><path class="a8wtkc ik2mhj iy2otu r1menc"/>',
				fallback: 'animated-line-24:remove-circle',
				states: ['focus'],
			},
		});
		expect(iconSet.classes).toEqual(originalClasses);
	});
});
