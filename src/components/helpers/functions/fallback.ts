import { createUniqueHashContext } from '../../../helpers/hash/context.js';
import { getUniqueHash } from '../../../helpers/hash/unique.js';
import type { GeneratedAssetFile } from '../../types/component.js';
import type { ComponentFactoryOptions } from '../../types/options.js';
import {
	defaultHelpersDirectory,
	getGeneratedAssetFilename,
} from '../filenames/asset.js';
import type { FactoryComponentImports } from '../imports/types.js';

const sharedFunctionName = 'getIconFallback';
const hashedFunctionName = 'getFallback';

// Copied from getIconFallback()
const functionContent = `
export function ${sharedFunctionName}(
    defaultValues,
    template,
    values,
) {
    const stateValue = (state) =>
        values[state] ?? defaultValues?.[state];
    return template
        .map((chunk) =>
            typeof chunk === 'string'
                ? chunk
                : 'values' in chunk
                    ? chunk.values[+!!stateValue(chunk.state)]
                    : stateValue(chunk.state)
        )
        .join('');
}
`;

/**
 * Adds getFallback() function to assets
 */
export function addFallbackFunctionAsset(
	imports: FactoryComponentImports,
	assets: GeneratedAssetFile[],
	options: Pick<ComponentFactoryOptions, 'rootPath' | 'helpersDirectory'>,
	defaultValues: Record<string, boolean | string>
) {
	// Hash default values
	const hash = getUniqueHash(defaultValues, {
		context: createUniqueHashContext(),
		css: true,
		length: 10,
	});

	// Add main function
	const assetDirectory = options.helpersDirectory ?? defaultHelpersDirectory;
	const sharedFilename = getGeneratedAssetFilename(
		`${assetDirectory}/fallback.js`,
		options.rootPath
	);
	assets.push({
		...sharedFilename,
		content: functionContent,
	});

	// Add function with default values as named import
	// Many icons have the same states with the same default values, so it is worth to reuse the same function for all of them
	const hashedFilename = getGeneratedAssetFilename(
		`${assetDirectory}/fallback-${hash}.js`,
		options.rootPath
	);
	assets.push({
		...hashedFilename,
		content: `import { ${sharedFunctionName} } from './fallback.js';

export const ${hashedFunctionName} = ${sharedFunctionName}.bind(null, ${JSON.stringify(defaultValues)});
`,
	});

	// Add import
	imports.named[hashedFilename.import] = new Set([hashedFunctionName]);
	return hashedFunctionName;
}
