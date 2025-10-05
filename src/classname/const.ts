// Class property
export const defaultClassProp = 'class';

// All class properties
export const classProps = [defaultClassProp] as const;

// Type
export type ClassProp = (typeof classProps)[number];
