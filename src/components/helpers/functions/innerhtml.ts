import type { GeneratedAssetFile } from '../../types/component.js';
import type { ComponentFactoryOptions } from '../../types/options.js';
import type { FactoryComponentImports } from '../imports/types.js';
import { addCustomFunctionAsset } from './custom.js';

const functionName = 'cleanupHTML';

/**
 * Adds cleanUpInnerHTML() function to assets
 */
export function addInnerHTMLFunctionAsset(
	imports: FactoryComponentImports,
	assets: GeneratedAssetFile[],
	options: Pick<ComponentFactoryOptions, 'rootPath' | 'helpersDirectory'>
) {
	const content = `let policy;

function createPolicy() {
	try {
		policy = window.trustedTypes.createPolicy('iconify', {
			createHTML: (s) => s,
		});
	} catch (err) {
		policy = null;
	}
}

export function ${functionName}(html) {
	if (policy === undefined) {
		createPolicy();
	}

	return policy ? policy.createHTML(html) : html;
}
`;

	addCustomFunctionAsset(imports, assets, options, {
		functionName,
		content,
		jsName: 'innerhtml',
	});
	return functionName;
}
