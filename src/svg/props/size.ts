/**
 * Regular expressions for calculating dimensions
 */
const unitsSplit = /(-?[0-9.]*[0-9]+[0-9.]*)/g;
const unitsTest = /^-?[0-9.]*[0-9]+[0-9.]*$/g;

/**
 * Calculate second dimension when only 1 dimension is set
 *
 * If you are calculating width, ratio should be width/height
 * If you are calculating height, ratio should be height/width
 */
export function calculateSize<T extends string | number>(
	size: T,
	ratio: number,
	precision?: number
): T {
	if (ratio === 1) {
		return size;
	}

	precision = precision || 100;
	if (typeof size === 'number') {
		return (Math.ceil(size * ratio * precision) / precision) as T;
	}

	if (typeof size !== 'string') {
		return size;
	}

	// Split code into sets of strings and numbers
	const oldParts = size.split(unitsSplit);
	if (oldParts === null || !oldParts.length) {
		return size;
	}

	const newParts = [];
	let code = oldParts.shift() as string;
	let isNumber = unitsTest.test(code);

	while (true) {
		if (isNumber) {
			const num = parseFloat(code);
			if (isNaN(num)) {
				newParts.push(code);
			} else {
				newParts.push(Math.ceil(num * ratio * precision) / precision);
			}
		} else {
			newParts.push(code);
		}

		// next
		code = oldParts.shift() as string;
		if (code === void 0) {
			return newParts.join('') as T;
		}

		isNumber = !isNumber;
	}
}
