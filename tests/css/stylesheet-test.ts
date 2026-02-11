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
			`.foo {
  color: red;
}

.bar {
  color: blue;
}
`
		);

		// Override selector
		addGeneratedSelector(css, ['.foo'], {
			color: 'green',
		});
		expect(stringifyStylesheet(css)).toBe(
			`.foo {
  color: green;
}

.bar {
  color: blue;
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
		expect(stringifyStylesheet(css)).toBe(
			`@keyframes fade {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
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
`
		);
	});
});
