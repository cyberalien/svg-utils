import { addComponentTypes } from './wrapper.js';

/**
 * Add React component types
 */
export const addReactComponentTypes = addComponentTypes.bind(
	null,
	`import type { ForwardRefExoticComponent, SVGProps } from 'react';

interface IconProps {
/* PROPS */
}

const Component: ForwardRefExoticComponent<
    Omit<SVGProps<SVGSVGElement>, 'viewBox' | 'width' | 'height' | 'xmlns'> & IconProps
>;

export { type IconProps };
export default Component;
`
);
