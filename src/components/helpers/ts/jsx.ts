import type { GeneratedAssetFile } from '../../types/component.js';
import type { FactoryIconData } from '../../types/data.js';
import type { JSXMode } from '../../types/jsx.js';
import type { ComponentFactoryOptions } from '../../types/options.js';
import type { FactoryComponentProps } from '../props/types.js';
import { addComponentTypes, omitComponentSVGProps } from './wrapper.js';

interface Options extends ComponentFactoryOptions {
	// JSX mode
	jsx: JSXMode;
}

const iconPropsTemplate = `interface IconProps {
/* PROPS */
}`;

const exportTemplate = `export { type IconProps };
export default Component;`;

/**
 * Add JSX component types
 */
export function addJSXComponentTypes(
	data: FactoryIconData,
	options: Options,
	assets: GeneratedAssetFile[],
	props: FactoryComponentProps
): string {
	let template: string;
	switch (options.jsx) {
		case 'react':
			template = `import type { ForwardRefExoticComponent, SVGProps } from 'react';

${iconPropsTemplate}

const Component: ForwardRefExoticComponent<
    Omit<SVGProps<SVGSVGElement>, ${omitComponentSVGProps}> & IconProps
>;

${exportTemplate}
`;
			break;

		case 'preact':
			template = `import type { JSX } from 'preact';

${iconPropsTemplate}

const Component: (props: Omit<JSX.SVGAttributes<SVGSVGElement>, ${omitComponentSVGProps}> & IconProps) => JSX.Element;

${exportTemplate}
`;
	}

	return addComponentTypes(template, data, options, assets, props);
}
