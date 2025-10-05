import { normaliseIconifyIcon } from '../../src/iconify/icon/nornalise.js';

describe('Parsing Iconify data', () => {
	it('Parsing IconifyIcon', () => {
		// Base icon
		expect(
			normaliseIconifyIcon({
				body: '<g />',
			})
		).toEqual({
			body: '<g />',
			viewBox: { left: 0, top: 0, width: 16, height: 16 },
		});

		// viewBox
		expect(
			normaliseIconifyIcon({
				body: '<g />',
				width: 32,
				height: 24,
				left: -10,
				top: -5,
			})
		).toEqual({
			body: '<g />',
			viewBox: { width: 32, height: 24, left: -10, top: -5 },
		});

		// Rotation
		expect(
			normaliseIconifyIcon({
				body: '<path d="..." />',
				width: 20,
				height: 16,
				rotate: 1,
			})
		).toEqual({
			body: '<g transform="rotate(90 8 8)"><path d="..." /></g>',
			viewBox: { width: 16, height: 20, left: 0, top: 0 },
		});

		// Negative rotation
		expect(
			normaliseIconifyIcon({
				body: '<path d="..." />',
				width: 20,
				height: 16,
				rotate: -1,
			})
		).toEqual({
			body: '<g transform="rotate(-90 10 10)"><path d="..." /></g>',
			viewBox: { width: 16, height: 20, left: 0, top: 0 },
		});

		// Horizontal flip
		expect(
			normaliseIconifyIcon({
				body: '<path d="..." />',
				width: 20,
				height: 16,
				hFlip: true,
			})
		).toEqual({
			body: '<g transform="translate(20 0) scale(-1 1)"><path d="..." /></g>',
			viewBox: { width: 20, height: 16, left: 0, top: 0 },
		});

		// Flip + rotation
		expect(
			normaliseIconifyIcon({
				body: '<path d="..." />',
				width: 20,
				height: 16,
				hFlip: true,
				rotate: 1,
			})
		).toEqual({
			body: '<g transform="rotate(90 8 8) translate(20 0) scale(-1 1)"><path d="..." /></g>',
			viewBox: { width: 16, height: 20, left: 0, top: 0 },
		});

		// Flip + rotation canceling out
		expect(
			normaliseIconifyIcon({
				body: '<path d="..." />',
				width: 20,
				height: 16,
				hFlip: true,
				vFlip: true,
				rotate: 2,
			})
		).toEqual({
			body: '<path d="..." />',
			viewBox: { width: 20, height: 16, left: 0, top: 0 },
		});
	});
});
