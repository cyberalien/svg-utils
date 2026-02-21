import type { IconStatesList } from '../types.js';

/**
 * Sub-parts of selector
 */
export interface StateSelectorSubParts {
	// Tag name: 'div', 'span'
	tag?: string;

	// ID: '#foo'
	id?: string;

	// Combinator: '>', '+', '~'
	// Rendered before selector
	combinator?: string;

	// class names: '.foo', '.bar'
	name?: Set<string>;

	// attributes: '[foo]', '[foo="bar"]'
	attr?: Set<string>;

	// pseudo-classes: ':hover', ':active'
	pseudo?: Set<string>;
}

/**
 * Parts of selector
 */
export interface StateSelectorParts {
	// At queries: '@media (max-width: 600px)'
	at?: string[];

	// Selectors for parent element
	parents?: StateSelectorSubParts[];

	// Selectors for SVG element
	svg?: StateSelectorSubParts;
}

export type StateSelectorData = StateSelectorParts[][];

/**
 * Class names config
 */
export type StatefulIconSelectorsConfig = Record<
	string,
	string | StateSelectorData | Record<string, string | StateSelectorData>
>;

/**
 * Data for generating selectors for states
 *
 * Includes config and cache
 */
export interface StatefulIconSelectorsContext {
	// Selectors for all states
	config: StatefulIconSelectorsConfig;

	// States
	states: IconStatesList;

	// Cached parsed data
	data: Record<string, StateSelectorData | null>;

	// Cached stringified selectors
	parsed: Record<string, string[][] | null>;
}
