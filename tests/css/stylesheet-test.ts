import {
	addGeneratedSelector,
	createEmptyStylesheet,
	stringifyStylesheet,
} from '../../src/css/stylesheet.js';

describe('Converting generating CSS', () => {
	it('Simple CSS', () => {
		const css = createEmptyStylesheet();

		// Empty
		expect(stringifyStylesheet(css)).toBe('');

		// Simple selector
		addGeneratedSelector(css, ['.foo'], {
			color: 'red',
		});
		expect(stringifyStylesheet(css)).toBe(`.foo {
  color: red;
}
`);

		// Another selector
		addGeneratedSelector(css, ['.bar'], {
			color: 'blue',
		});
		expect(stringifyStylesheet(css)).toBe(
			`.bar {
  color: blue;
}

.foo {
  color: red;
}
`
		);

		// Override selector
		addGeneratedSelector(css, ['.foo'], {
			color: 'green',
		});
		expect(stringifyStylesheet(css)).toBe(
			`.bar {
  color: blue;
}

.foo {
  color: green;
}
`
		);

		// Empty selector
		addGeneratedSelector(css, ['.empty'], {});
		expect(stringifyStylesheet(css)).toBe(
			`.bar {
  color: blue;
}

.foo {
  color: green;
}
`
		);

		// Nested CSS
		addGeneratedSelector(css, ['.foo', '.bar'], {
			color: 'yellow',
		});
		expect(stringifyStylesheet(css)).toBe(
			`.bar {
  color: blue;
}

.foo {
  color: green;
}

.foo {
  .bar {
    color: yellow;
  }
}
`
		);
		expect(stringifyStylesheet(css, true)).toBe(
			`.bar {
  color: blue;
}

.foo {
  color: green;
}

.foo .bar {
  color: yellow;
}
`
		);

		// Add media query
		addGeneratedSelector(css, ['.foo', '@media (max-width: 600px)'], {
			color: '#123456',
		});
		addGeneratedSelector(
			css,
			['.foo', '.bar', '@media (max-width: 600px)'],
			{
				color: '#234567',
			}
		);
		expect(stringifyStylesheet(css)).toBe(
			`.bar {
  color: blue;
}

.foo {
  color: green;
}

.foo {
  .bar {
    color: yellow;
  }

  .bar {
    @media (max-width: 600px) {
      color: #234567;
    }
  }

  @media (max-width: 600px) {
    color: #123456;
  }
}
`
		);
		expect(stringifyStylesheet(css, true)).toBe(
			`.bar {
  color: blue;
}

.foo {
  color: green;
}

.foo .bar {
  color: yellow;
}

@media (max-width: 600px) {
  .foo {
    color: #123456;
  }

  .foo .bar {
    color: #234567;
  }
}
`
		);
	});

	it('Animations', () => {
		const css = createEmptyStylesheet();

		// Add keyframes
		css.keyframes['fade'] = {
			prop: 'opacity',
			frames: [
				{ time: 0, value: '0' },
				{ time: 1, value: '1' },
			],
		};
		css.keyframes['fade-out'] = '100% { opacity: 0 }';
		expect(stringifyStylesheet(css)).toBe(
			`@keyframes fade {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@keyframes fade-out {
  100% { opacity: 0 }
}
`
		);

		// Add selector with animation
		addGeneratedSelector(css, ['.fade'], {
			opacity: '1',
		});
		addGeneratedSelector(
			css,
			['@media (prefers-reduced-motion)', '.fade'],
			{
				animation: 'fade 1s',
			}
		);
		expect(stringifyStylesheet(css)).toBe(
			`.fade {
  opacity: 1;
}

@media (prefers-reduced-motion) {
  .fade {
    animation: fade 1s;
  }
}

@keyframes fade {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@keyframes fade-out {
  100% { opacity: 0 }
}
`
		);

		addGeneratedSelector(css, ['.fade-out'], {
			opacity: '0',
		});
		addGeneratedSelector(
			css,
			['@media (prefers-reduced-motion)', '.fade-out'],
			{
				animation: 'fade 1s reverse',
			}
		);
		expect(stringifyStylesheet(css)).toBe(
			`.fade {
  opacity: 1;
}

.fade-out {
  opacity: 0;
}

@media (prefers-reduced-motion) {
  .fade {
    animation: fade 1s;
  }

  .fade-out {
    animation: fade 1s reverse;
  }
}

@keyframes fade {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@keyframes fade-out {
  100% { opacity: 0 }
}
`
		);
	});
});
