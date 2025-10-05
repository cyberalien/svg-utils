import { getComponentSizeValues } from '../../src/components/helpers/content/size.js';

describe('Getting size for component factory', () => {
	it('Square icons', () => {
		// No size
		expect(
			getComponentSizeValues({}, { width: 24, height: 24 })
		).toBeUndefined();

		// Both sizes
		expect(
			getComponentSizeValues(
				{ width: '1em', height: '1em' },
				{ width: 24, height: 24 }
			)
		).toEqual({ width: '1em', height: '1em' });

		// Width only
		expect(
			getComponentSizeValues({ width: '1em' }, { width: 24, height: 24 })
		).toEqual({ width: '1em', height: '1em' });

		// Height only
		expect(
			getComponentSizeValues({ height: '1em' }, { width: 24, height: 24 })
		).toEqual({ width: '1em', height: '1em' });
	});

	it('Non-square icons', () => {
		// No size
		expect(
			getComponentSizeValues({}, { width: 24, height: 32 })
		).toBeUndefined();

		// Both sizes
		expect(
			getComponentSizeValues(
				{ width: '0.75em', height: '1em' },
				{ width: 24, height: 32 }
			)
		).toEqual({ width: '0.75em', height: '1em' });

		// Width only
		expect(
			getComponentSizeValues({ width: '1em' }, { width: 24, height: 32 })
		).toEqual({ width: '1em', height: '1.34em' });

		expect(
			getComponentSizeValues(
				{ width: '1em', square: true },
				{ width: 24, height: 32 }
			)
		).toEqual({ width: '1em', height: '1em' });

		// Height only
		expect(
			getComponentSizeValues({ height: '1em' }, { width: 24, height: 32 })
		).toEqual({ width: '0.75em', height: '1em' });

		expect(
			getComponentSizeValues(
				{ height: '1em', square: true },
				{ width: 24, height: 32 }
			)
		).toEqual({ width: '1em', height: '1em' });
	});
});
