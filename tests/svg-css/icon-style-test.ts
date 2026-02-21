import {
	createEmptyStylesheet,
	stringifyStylesheet,
	type SVGCSSIcon,
} from '../../src/index.js';
import { renderSVGCSSIconStyle } from '../../src/svg-css/icon/css/basic.js';

const scanIcon: SVGCSSIcon = {
	content:
		'<defs><mask id="SVGQXdDfesW"><path class="hz1ecu iy2otu r1menc"/><path class="al390y e_64it l93fye r1menc"/><path class="al390y jnc8yq q090lg r1menc"/></mask></defs><rect class="i7rily"/><path mask="url(#SVGQXdDfesW)" class="c7cd9u"/><path class="e_64it iy2otu j92okf l93fye r1menc"/><path class="iy2otu j92okf jnc8yq q090lg r1menc"/>',
	viewBox: {
		left: 0,
		top: 0,
		width: 20,
		height: 24,
	},
	// Mix strings and objects for testing
	classes: {
		iy2otu: { 'stroke-width': 'var(--svg-stroke-width, 1.5px)' },
		l93fye: "d:path('M15 4h1c1.1 0 2 0.9 2 2v1M2 7v-1c0 -1.1 0.9 -2 2 -2h1');",
		q090lg: "d:path('M18 17v1c0 1.1 -0.9 2 -2 2h-1M5 20h-1c-1.1 0 -2 -0.9 -2 -2v-1');",
		j92okf: { stroke: '#459330' },
		r1menc: {
			'stroke-linecap': 'round',
			'stroke-linejoin': 'round',
			'fill': 'none',
		},
		hz1ecu: "d:path('M3 12h14');stroke:#fff;",
		al390y: 'stroke-width:var(--svg-mask-width, calc(var(--svg-stroke-width, 1.5px) + 1px));stroke:#000;',
		i7rily: 'width:20px;height:24px;fill:#eee;',
		c7cd9u: "d:path('M0 0h20v24H0z');fill:#486496;",
	},
	animations: {
		hz1ecu: 'animation:1.8s linear infinite transform-umhjop;',
		e_64it: { animation: '1.8s linear infinite d-f7-mqq' },
		jnc8yq: 'animation:1.8s linear infinite d-k-82ex;',
	},
};

const expectedStyles: Record<string, string> = {
	iy2otu: '.iy2otu {\n  stroke-width: var(--svg-stroke-width, 1.5px);\n}\n',
	l93fye:
		'.l93fye {\n' +
		"  d: path('M15 4h1c1.1 0 2 0.9 2 2v1M2 7v-1c0 -1.1 0.9 -2 2 -2h1');\n" +
		'}\n',
	q090lg:
		'.q090lg {\n' +
		"  d: path('M18 17v1c0 1.1 -0.9 2 -2 2h-1M5 20h-1c-1.1 0 -2 -0.9 -2 -2v-1');\n" +
		'}\n',
	j92okf: '.j92okf {\n  stroke: #459330;\n}\n',
	r1menc:
		'.r1menc {\n' +
		'  stroke-linecap: round;\n' +
		'  stroke-linejoin: round;\n' +
		'  fill: none;\n' +
		'}\n',
	al390y:
		'.al390y {\n' +
		'  stroke-width: var(--svg-mask-width, calc(var(--svg-stroke-width, 1.5px) + 1px));\n  stroke: #000;\n' +
		'}\n',
	i7rily: '.i7rily {\n  width: 20px;\n  height: 24px;\n  fill: #eee;\n}\n',
	c7cd9u: ".c7cd9u {\n  d: path('M0 0h20v24H0z');\n  fill: #486496;\n}\n",
};

describe('Rendering SVG+CSS icons', () => {
	test('Basic icon, common stylesheet', () => {
		const stylesheet = createEmptyStylesheet();

		// Empty icon
		expect(
			renderSVGCSSIconStyle(
				{
					viewBox: '0 0 24 24',
					content: '<path d="M0 0h24v24H0z" />',
				},
				stylesheet
			)
		).toEqual({});
		expect(stringifyStylesheet(stylesheet)).toBe('');

		// Scan icon
		expect(renderSVGCSSIconStyle(scanIcon, stylesheet)).toEqual({});
		expect(stringifyStylesheet(stylesheet)).toBe(`${expectedStyles.al390y}
${expectedStyles.c7cd9u}
.hz1ecu {
  d: path('M3 12h14');
  stroke: #fff;
}

${expectedStyles.i7rily}
${expectedStyles.iy2otu}
${expectedStyles.j92okf}
${expectedStyles.l93fye}
${expectedStyles.q090lg}
${expectedStyles.r1menc}
@media not (prefers-reduced-motion) {
  .e_64it {
    animation: 1.8s linear infinite d-f7-mqq;
  }

  .hz1ecu {
    animation: 1.8s linear infinite transform-umhjop;
  }

  .jnc8yq {
    animation: 1.8s linear infinite d-k-82ex;
  }
}
`);
	});

	test('Basic icon, split stylesheets', () => {
		// Empty icon
		expect(
			renderSVGCSSIconStyle({
				viewBox: '0 0 24 24',
				content: '<path d="M0 0h24v24H0z" />',
			})
		).toEqual({});

		// Scan icon
		expect(
			Object.fromEntries(
				Object.entries(renderSVGCSSIconStyle(scanIcon)).map(
					([key, value]) => [key, stringifyStylesheet(value)]
				)
			)
		).toEqual({
			// Base styles
			...expectedStyles,
			// Animations
			hz1ecu:
				'.hz1ecu {\n' +
				"  d: path('M3 12h14');\n  stroke: #fff;\n" +
				'}\n\n' +
				'@media not (prefers-reduced-motion) {\n' +
				'  .hz1ecu {\n' +
				'    animation: 1.8s linear infinite transform-umhjop;\n' +
				'  }\n' +
				'}\n',
			e_64it:
				'@media not (prefers-reduced-motion) {\n' +
				'  .e_64it {\n' +
				'    animation: 1.8s linear infinite d-f7-mqq;\n' +
				'  }\n' +
				'}\n',
			jnc8yq:
				'@media not (prefers-reduced-motion) {\n' +
				'  .jnc8yq {\n' +
				'    animation: 1.8s linear infinite d-k-82ex;\n' +
				'  }\n' +
				'}\n',
		});
	});
});
