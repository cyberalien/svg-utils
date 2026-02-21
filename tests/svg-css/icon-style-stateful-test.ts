import {
	createEmptyStylesheet,
	stringifyStylesheet,
	type SVGCSSStatefulIcon,
} from '../../src/index.js';
import { renderStatefulSVGCSSIconStyle } from '../../src/svg-css/icon/css/render.js';
import { createStatefulIconSelectorsContext } from '../../src/svg-css/states/selector/parse.js';

const testIcon: SVGCSSStatefulIcon = {
	content:
		'<defs><mask id="SVGSsXvhbBM"><path class="iy2otu mz6rrw r1menc zzz4jg"/><path class="al390y h2mb7i r1menc z6za9t"/></mask></defs><rect class="i7rily"/><path mask="url(#SVGSsXvhbBM)" class="c7cd9u"/><path class="h2mb7i iy2otu j92okf r1menc z6za9t"/>',
	viewBox: {
		left: 0,
		top: 0,
		width: 20,
		height: 24,
	},
	classes: {
		iy2otu: 'stroke-width:var(--svg-stroke-width, 1.5px);',
		z6za9t: "d:path('M2 12h16');",
		j92okf: 'stroke:#459330;',
		r1menc: 'stroke-linecap:round;stroke-linejoin:round;fill:none;',
		zzz4jg: "d:path('M10 12v0');stroke:#fff;",
		al390y: 'stroke-width:var(--svg-mask-width, calc(var(--svg-stroke-width, 1.5px) + 1px));stroke:#000;',
		i7rily: 'width:20px;height:24px;fill:#eee;',
		c7cd9u: "d:path('M0 0h20v24H0z');fill:#486496;",
	},
	animations: {
		mz6rrw: 'stroke-dasharray:20;animation:0.3s linear forwards so-from-20;',
		h2mb7i: 'stroke-dasharray:20;stroke-dashoffset:20;animation:0.3s linear 0.3s forwards so-to-0;',
	},
	statefulClasses: {
		z6za9t: {
			stateRules: {
				focus: "d:path('M1 12h18');",
				action_focus: "d:path('M1 12h18');",
			},
			transition: 'transition:d 0.4s linear;',
		},
		zzz4jg: {
			stateRules: {
				action: "d:path('M10 4v16');",
				action_focus: "d:path('M10 3v18');",
			},
			transition: 'transition:d 0.4s linear;',
		},
	},
	states: ['action', 'focus'],
	fallback: 'animated-line-24:{action?plus|minus}',
	keyframes: {
		'so-from-20': '@keyframes so-from-20{0%{stroke-dashoffset:20}}',
		'so-to-0': '@keyframes so-to-0{100%{stroke-dashoffset:0}}',
	},
};

describe('Rendering SVG+CSS icons', () => {
	test('Stateful icon', () => {
		const stylesheet = createEmptyStylesheet();

		expect(
			renderStatefulSVGCSSIconStyle(
				testIcon,
				createStatefulIconSelectorsContext(
					{
						action: '&.state-action',
						focus: '.focus-trigger:focus',
					},
					testIcon.states!
				),
				stylesheet
			)
		).toEqual({});
		expect(stringifyStylesheet(stylesheet)).toBe(`.al390y {
  stroke-width: var(--svg-mask-width, calc(var(--svg-stroke-width, 1.5px) + 1px));
  stroke: #000;
}

.c7cd9u {
  d: path('M0 0h20v24H0z');
  fill: #486496;
}

.focus-trigger:focus {
  .z6za9t {
    d: path('M1 12h18');
  }

  svg.state-action {
    .z6za9t {
      d: path('M1 12h18');
    }

    .zzz4jg {
      d: path('M10 3v18');
    }
  }
}

.i7rily {
  width: 20px;
  height: 24px;
  fill: #eee;
}

.iy2otu {
  stroke-width: var(--svg-stroke-width, 1.5px);
}

.j92okf {
  stroke: #459330;
}

.r1menc {
  stroke-linecap: round;
  stroke-linejoin: round;
  fill: none;
}

.z6za9t {
  d: path('M2 12h16');
}

.zzz4jg {
  d: path('M10 12v0');
  stroke: #fff;
}

svg.state-action {
  .zzz4jg {
    d: path('M10 4v16');
  }
}

@media not (prefers-reduced-motion) {
  .h2mb7i {
    stroke-dasharray: 20;
    stroke-dashoffset: 20;
    animation: 0.3s linear 0.3s forwards so-to-0;
  }

  .mz6rrw {
    stroke-dasharray: 20;
    animation: 0.3s linear forwards so-from-20;
  }

  .z6za9t {
    transition: d 0.4s linear;
  }

  .zzz4jg {
    transition: d 0.4s linear;
  }
}

@keyframes so-from-20{0%{stroke-dashoffset:20}}
@keyframes so-to-0{100%{stroke-dashoffset:0}}`);
	});
});
