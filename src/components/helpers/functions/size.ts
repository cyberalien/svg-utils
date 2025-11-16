import {
	defaultHelpersDirectory,
	getGeneratedAssetFilename,
} from '../filenames/asset.js';
import type { ComponentFactoryOptions } from '../../types/options.js';
import type { FactoryComponentImports } from '../imports/types.js';
import type { GeneratedAssetFile } from '../../types/component.js';

const functionName = 'getSizeProps';

// Copied from calculateSize(), but with string values only
const functionContent = `
const unitsSplit = /(-?[0-9.]*[0-9]+[0-9.]*)/g;
const unitsTest = /^-?[0-9.]*[0-9]+[0-9.]*$/g;

const precision = 100;

function calculateSize(size, ratio) {
    if (ratio === 1) {
        return size;
    }

    const oldParts = size.split(unitsSplit);
	if (oldParts === null || !oldParts.length) {
		return size;
	}

    const newParts = [];
	let code = oldParts.shift();
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

		code = oldParts.shift();
		if (code === undefined) {
			return newParts.join('');
		}

		isNumber = !isNumber;
	}
}

function ${functionName}(width, height, ratio) {
    if (width && height) {
        return { width, height };
    }
    if (height) {
        return {
            width: calculateSize(height, ratio),
            height,
        };
    }
    if (width) {
        return {
            width,
            height: calculateSize(width, 1 / ratio),
        };
    }
    return {};
}

export { ${functionName} };
`;

/**
 * Adds getSizeProps() function to assets
 */
export function addSizeFunctionAsset(
	imports: FactoryComponentImports,
	assets: GeneratedAssetFile[],
	options: Pick<ComponentFactoryOptions, 'rootPath' | 'helpersDirectory'>
) {
	const filename = getGeneratedAssetFilename(
		`${options.helpersDirectory ?? defaultHelpersDirectory}/size.js`,
		options.rootPath
	);

	// Add content
	imports.named[filename.import] = new Set([functionName]);
	assets.push({
		...filename,
		content: functionContent,
	});

	return functionName;
}
