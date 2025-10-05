import { parseViewBox } from '../../src/svg/viewbox/parse.js';
import { makeSquareViewBox } from '../../src/svg/viewbox/square.js';

describe('Testing viewBox', () => {
	it('Parsing string', () => {
		expect(parseViewBox('0 0 16 24')).toEqual({
			left: 0,
			top: 0,
			width: 16,
			height: 24,
		});

		expect(parseViewBox('-10.5   11.5   128\t256')).toEqual({
			left: -10.5,
			top: 11.5,
			width: 128,
			height: 256,
		});

		expect(parseViewBox('0 16 16')).toBeUndefined();
		expect(parseViewBox('0 0 0 16 16')).toBeUndefined();
		expect(parseViewBox('0 0a 16 16')).toBeUndefined();
	});

	it('Square viewBox', () => {
		// No changes
		expect(
			makeSquareViewBox({
				width: 24,
				height: 24,
			})
		).toEqual({
			width: 24,
			height: 24,
		});

		// Make it wider
		expect(
			makeSquareViewBox({
				width: 16,
				height: 24,
			})
		).toEqual({
			left: -4,
			width: 24,
			height: 24,
		});

		expect(
			makeSquareViewBox({
				cx: 12,
				width: 16,
				height: 24,
			})
		).toEqual({
			left: 0,
			width: 24,
			height: 24,
		});

		expect(
			makeSquareViewBox({
				left: -10,
				top: -20,
				width: 16,
				height: 24,
			})
		).toEqual({
			left: -14,
			top: -20,
			width: 24,
			height: 24,
		});

		// Make it taller
		expect(
			makeSquareViewBox({
				width: 32,
				height: 24,
			})
		).toEqual({
			top: -4,
			width: 32,
			height: 32,
		});
	});
});
