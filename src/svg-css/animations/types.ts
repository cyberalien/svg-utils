import type { ParsedXMLTagElement } from '../../xml/types.js';

/**
 * SVG animations context
 */
interface FailedSVGAnimationsContext {
	failed: true;
}

interface SuccessfulSVGAnimationsContext {
	failed: false;

	// Map of animated properties in tags
	animatedProperties: Map<ParsedXMLTagElement, Set<string>>;
}

export type SVGAnimationsContext =
	| FailedSVGAnimationsContext
	| SuccessfulSVGAnimationsContext;

/**
 * Options for finding animations in SVG tree
 */
export interface FindSVGAnimationsOptions {
	// Support legacy browsers
	supportLegacyBrowsers?: boolean;
}
