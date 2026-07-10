import {
	type SVGCSSIcon,
	changeSVGCSSIconClassnames,
} from '../../src/index.js';

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
		q090lg:
			"d:path('M18 17v1c0 1.1 -0.9 2 -2 2h-1M5 20h-1c-1.1 0 -2 -0.9 -2 -2v-1');",
		j92okf: { stroke: '#459330' },
		r1menc: {
			'stroke-linecap': 'round',
			'stroke-linejoin': 'round',
			'fill': 'none',
		},
		hz1ecu: "d:path('M3 12h14');stroke:#fff;",
		al390y:
			'stroke-width:var(--svg-mask-width, calc(var(--svg-stroke-width, 1.5px) + 1px));stroke:#000;',
		i7rily: 'width:20px;height:24px;fill:#eee;',
		c7cd9u: "d:path('M0 0h20v24H0z');fill:#486496;",
	},
	animations: {
		hz1ecu: 'animation:1.8s linear infinite transform-umhjop;',
		e_64it: { animation: '1.8s linear infinite d-f7-mqq' },
		jnc8yq: 'animation:1.8s linear infinite d-k-82ex;',
	},
};

describe('Testing changing stateful icon', () => {
	test('Stateful icon', () => {
		const backup = JSON.parse(JSON.stringify(scanIcon));
		expect(
			changeSVGCSSIconClassnames(
				scanIcon,
				(className) => `test-${className}`,
				(id) => `Test${id}`
			)
		).toEqual({
			content:
				'<defs><mask id="TestSVGQXdDfesW"><path class="test-hz1ecu test-iy2otu test-r1menc"/><path class="test-al390y test-e_64it test-l93fye test-r1menc"/><path class="test-al390y test-jnc8yq test-q090lg test-r1menc"/></mask></defs><rect class="test-i7rily"/><path mask="url(#TestSVGQXdDfesW)" class="test-c7cd9u"/><path class="test-e_64it test-iy2otu test-j92okf test-l93fye test-r1menc"/><path class="test-iy2otu test-j92okf test-jnc8yq test-q090lg test-r1menc"/>',
			viewBox: {
				left: 0,
				top: 0,
				width: 20,
				height: 24,
			},
			// Mix strings and objects for testing
			classes: {
				'test-iy2otu': { 'stroke-width': 'var(--svg-stroke-width, 1.5px)' },
				'test-l93fye':
					"d:path('M15 4h1c1.1 0 2 0.9 2 2v1M2 7v-1c0 -1.1 0.9 -2 2 -2h1');",
				'test-q090lg':
					"d:path('M18 17v1c0 1.1 -0.9 2 -2 2h-1M5 20h-1c-1.1 0 -2 -0.9 -2 -2v-1');",
				'test-j92okf': { stroke: '#459330' },
				'test-r1menc': {
					'stroke-linecap': 'round',
					'stroke-linejoin': 'round',
					'fill': 'none',
				},
				'test-hz1ecu': "d:path('M3 12h14');stroke:#fff;",
				'test-al390y':
					'stroke-width:var(--svg-mask-width, calc(var(--svg-stroke-width, 1.5px) + 1px));stroke:#000;',
				'test-i7rily': 'width:20px;height:24px;fill:#eee;',
				'test-c7cd9u': "d:path('M0 0h20v24H0z');fill:#486496;",
			},
			animations: {
				'test-hz1ecu': 'animation:1.8s linear infinite transform-umhjop;',
				'test-e_64it': { animation: '1.8s linear infinite d-f7-mqq' },
				'test-jnc8yq': 'animation:1.8s linear infinite d-k-82ex;',
			},
		});

		// Make sure original icon was not changed
		expect(backup).toEqual(scanIcon);
	});
});
