/**
 * Tag
 */
export interface ParsedXMLTagElement {
	type: 'tag';

	// Tag name
	tag: string;

	// Attributes
	attribs: Record<string, string | number>;

	// Child elements
	children: ParsedXMLNode[];
}

/**
 * Text
 */
export interface ParsedXMLTextElement {
	type: 'text';

	// Content
	content: string;
}

/**
 * Element in tree
 */
export type ParsedXMLNode = ParsedXMLTagElement | ParsedXMLTextElement;

/**
 * Options for stringifying XML
 */
export interface StringifyXMLOptions {
	useSelfClosing?: boolean;
	numberTemplate?: string;
	prettyPrint?: boolean | string;
}
