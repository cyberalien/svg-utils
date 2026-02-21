import { mergeMultipleSelectorSubParts } from '../../src/svg-css/states/selector/sub/merge.js';
import { splitSelectorToSubParts } from '../../src/svg-css/states/selector/sub/split.js';
import { splitSelectorToParts } from '../../src/svg-css/states/selector/part/split.js';
import type { StateSelectorSubParts } from '../../src/svg-css/states/selector/types.js';
import { mergeSelectorParts } from '../../src/svg-css/states/selector/part/merge.js';
import { stringifySelectorSubParts } from '../../src/svg-css/states/selector/sub/stringify.js';
import { stringifySelectorParts } from '../../src/svg-css/states/selector/part/stringify.js';
import { splitSelectorsForState } from '../../src/svg-css/states/selector/split.js';
import { mergeSelectorsForStates } from '../../src/svg-css/states/selector/merge.js';
import { stringifySelectorsForState } from '../../src/svg-css/states/selector/stringify.js';
import {
	createStatefulIconSelectorsContext,
	getSelectorsForStateValues,
} from '../../src/svg-css/states/selector/parse.js';

describe('Testing selector template', () => {
	test('Split selector part into sub-parts', () => {
		expect(splitSelectorToSubParts('.foo[bar="baz"]:hover:active')).toEqual(
			{
				name: new Set(['.foo']),
				attr: new Set(['[bar="baz"]']),
				pseudo: new Set([':hover', ':active']),
			}
		);

		// Selector with only class name
		expect(splitSelectorToSubParts('.foo')).toEqual({
			name: new Set(['.foo']),
		});
		expect(splitSelectorToSubParts('.foo.bar')).toEqual({
			name: new Set(['.foo', '.bar']),
		});

		// Selector with only attribute
		expect(splitSelectorToSubParts('[bar="baz"]')).toEqual({
			attr: new Set(['[bar="baz"]']),
		});
		expect(splitSelectorToSubParts('[bar="baz"][test]')).toEqual({
			attr: new Set(['[bar="baz"]', '[test]']),
		});

		// Selector with only pseudo-classes
		expect(splitSelectorToSubParts(':hover')).toEqual({
			pseudo: new Set([':hover']),
		});
		expect(splitSelectorToSubParts(':hover:focus')).toEqual({
			pseudo: new Set([':hover', ':focus']),
		});

		// Empty selector
		expect(splitSelectorToSubParts('')).toEqual({});

		// Tag name
		expect(splitSelectorToSubParts('div')).toEqual({
			tag: 'div',
		});

		expect(splitSelectorToSubParts('input:focus')).toEqual({
			tag: 'input',
			pseudo: new Set([':focus']),
		});

		// ID
		expect(splitSelectorToSubParts('#foo')).toEqual({
			id: '#foo',
		});

		// Tag + id
		expect(splitSelectorToSubParts('label#test:focus')).toEqual({
			tag: 'label',
			id: '#test',
			pseudo: new Set([':focus']),
		});

		// Combinator
		expect(splitSelectorToSubParts('>')).toEqual({
			combinator: '>',
		});

		expect(splitSelectorToSubParts('>svg')).toEqual({
			combinator: '>',
			tag: 'svg',
		});
	});

	test('Merge multiple selector sub-parts', () => {
		const parts: StateSelectorSubParts[] = [
			{ name: new Set(['.foo']) },
			{ attr: new Set(['[bar="baz"]']) },
			{ pseudo: new Set([':hover']) },
		];
		expect(mergeMultipleSelectorSubParts(parts)).toEqual({
			name: new Set(['.foo']),
			attr: new Set(['[bar="baz"]']),
			pseudo: new Set([':hover']),
		});

		// Merging parts with overlapping keys
		const overlappingParts: StateSelectorSubParts[] = [
			{ tag: 'div', name: new Set(['.foo']) },
			{ tag: 'div', name: new Set(['.bar']) },
			{ id: '#foo', attr: new Set(['[bar="baz"]']) },
			{ id: '#foo', attr: new Set(['[foo="qux"]']) },
			{ pseudo: new Set([':hover']) },
			{ pseudo: new Set([':active']) },
		];
		expect(mergeMultipleSelectorSubParts(overlappingParts)).toEqual({
			tag: 'div',
			id: '#foo',
			name: new Set(['.foo', '.bar']),
			attr: new Set(['[bar="baz"]', '[foo="qux"]']),
			pseudo: new Set([':hover', ':active']),
		});

		// Combinator
		expect(
			mergeMultipleSelectorSubParts([
				{
					combinator: '>',
				},
				{
					combinator: '>',
					id: '#foo',
				},
			])
		).toEqual({
			combinator: '>',
			id: '#foo',
		});

		// Bad data
		expect(
			mergeMultipleSelectorSubParts([{ tag: 'div' }, { tag: 'label' }])
		).toBeNull();
		expect(
			mergeMultipleSelectorSubParts([{ id: '#foo' }, { id: '#bar' }])
		).toBeNull();
		expect(
			mergeMultipleSelectorSubParts([
				{ combinator: '>' },
				{ combinator: '+' },
			])
		).toBeNull();
	});

	test('Stringify selector sub-parts', () => {
		expect(
			stringifySelectorSubParts({
				tag: 'div',
				id: '#foo',
				name: new Set(['.bar']),
				attr: new Set(['[baz="qux"]']),
				pseudo: new Set([':hover']),
			})
		).toBe('div#foo.bar[baz="qux"]:hover');

		// Only class name
		expect(
			stringifySelectorSubParts({
				name: new Set(['.foo']),
			})
		).toBe('.foo');
		expect(
			stringifySelectorSubParts(
				{
					name: new Set(['.foo']),
				},
				true
			)
		).toBe('svg.foo');

		// Only attribute
		expect(
			stringifySelectorSubParts({
				attr: new Set(['[bar="baz"]']),
			})
		).toBe('[bar="baz"]');
		expect(
			stringifySelectorSubParts(
				{
					attr: new Set(['[bar="baz"]']),
				},
				true
			)
		).toBe('svg[bar="baz"]');

		// Only pseudo-classes (should be sorted and prefixed with *)
		expect(
			stringifySelectorSubParts({
				pseudo: new Set([':hover', ':active']),
			})
		).toBe('*:active:hover');
		expect(
			stringifySelectorSubParts(
				{
					pseudo: new Set([':hover', ':active']),
				},
				true
			)
		).toBe('svg:active:hover');

		// Empty selector
		expect(stringifySelectorSubParts({})).toBe('');
		expect(stringifySelectorSubParts({}, true)).toBe('');

		// Combinator
		expect(
			stringifySelectorSubParts({
				combinator: '>',
			})
		).toBe('& > ');

		// Tag name (ignored for SVG)
		expect(
			stringifySelectorSubParts({
				tag: 'div',
			})
		).toBe('div');
		expect(
			stringifySelectorSubParts(
				{
					tag: 'div',
				},
				true
			)
		).toBe('');

		// ID (ignored for SVG)
		expect(
			stringifySelectorSubParts({
				id: '#foo',
			})
		).toBe('#foo');
		expect(
			stringifySelectorSubParts(
				{
					id: '#foo',
				},
				true
			)
		).toBe('');
	});

	test('Split selector into parts', () => {
		// Simple selector
		expect(splitSelectorToParts('.foo')).toEqual({
			parents: [
				{
					name: new Set(['.foo']),
				},
			],
		});
		expect(splitSelectorToParts('&.foo')).toEqual({
			svg: {
				name: new Set(['.foo']),
			},
		});

		expect(splitSelectorToParts('label:focus .bar')).toEqual({
			parents: [
				{
					tag: 'label',
					pseudo: new Set([':focus']),
				},
				{
					name: new Set(['.bar']),
				},
			],
		});

		// Media only
		expect(splitSelectorToParts('@media (max-width: 600px)')).toEqual({
			at: ['@media (max-width: 600px)'],
		});

		expect(
			splitSelectorToParts('@container tall (height > 30rem)')
		).toEqual({
			at: ['@container tall (height > 30rem)'],
		});

		expect(splitSelectorToParts('@layer state')).toEqual({
			at: ['@layer state'],
		});

		expect(
			splitSelectorToParts('@supports not (not (transform-origin: 2px))')
		).toEqual({
			at: ['@supports not (not (transform-origin: 2px))'],
		});

		expect(
			splitSelectorToParts(
				'@supports (display: grid) and (not (display: inline-grid))'
			)
		).toEqual({
			at: ['@supports (display: grid) and (not (display: inline-grid))'],
		});

		// Attribute selector only
		expect(splitSelectorToParts('[data-state="active"]')).toEqual({
			parents: [
				{
					attr: new Set(['[data-state="active"]']),
				},
			],
		});

		// Media, followed by class name
		expect(splitSelectorToParts('@layer state .foo')).toEqual({
			at: ['@layer state'],
			parents: [
				{
					name: new Set(['.foo']),
				},
			],
		});
		expect(splitSelectorToParts('@layer state &.foo')).toEqual({
			at: ['@layer state'],
			svg: {
				name: new Set(['.foo']),
			},
		});

		// Combinators
		expect(splitSelectorToParts('.foo > .bar')).toEqual({
			parents: [
				{
					name: new Set(['.foo']),
				},
				{
					combinator: '>',
					name: new Set(['.bar']),
				},
			],
		});
		expect(splitSelectorToParts('.foo +.bar')).toEqual({
			parents: [
				{
					name: new Set(['.foo']),
				},
				{
					combinator: '+',
					name: new Set(['.bar']),
				},
			],
		});
		expect(splitSelectorToParts('.foo~.bar')).toEqual({
			parents: [
				{
					name: new Set(['.foo']),
				},
				{
					combinator: '~',
					name: new Set(['.bar']),
				},
			],
		});

		// Bad selector
		expect(splitSelectorToParts('&.foo .bar')).toBeNull();
	});

	test('Merge selectors', () => {
		// Nothing to merge
		expect(
			mergeSelectorParts([
				{
					at: ['@media (max-width: 600px)'],
					parents: [
						{
							tag: 'input',
							pseudo: new Set([':focus']),
						},
					],
					svg: {
						name: new Set(['.foo']),
					},
				},
			])
		).toEqual([
			{
				at: ['@media (max-width: 600px)'],
				parents: [
					{
						tag: 'input',
						pseudo: new Set([':focus']),
					},
				],
				svg: {
					name: new Set(['.foo']),
				},
			},
		]);

		// Simple merge with no overlap
		expect(
			mergeSelectorParts([
				{
					svg: {
						name: new Set(['.state-test']),
					},
				},
				{
					parents: [
						{
							name: new Set(['.animate-on-focus']),
							pseudo: new Set([':focus-within']),
						},
						{
							name: new Set(['.animate-on-hover']),
							pseudo: new Set([':hover']),
						},
					],
				},
			])
		).toEqual([
			{
				svg: {
					name: new Set(['.state-test']),
				},
				parents: [
					{
						name: new Set(['.animate-on-focus']),
						pseudo: new Set([':focus-within']),
					},
					{
						name: new Set(['.animate-on-hover']),
						pseudo: new Set([':hover']),
					},
				],
			},
		]);

		// Merge SVG class names
		expect(
			mergeSelectorParts([
				{
					svg: {
						name: new Set(['.state-test']),
						pseudo: new Set([':hover']),
					},
				},
				{
					svg: {
						name: new Set(['.state-foo']),
					},
				},
				{
					svg: {
						name: new Set(['.state-bar']),
					},
				},
			])
		).toEqual([
			{
				svg: {
					name: new Set(['.state-test', '.state-foo', '.state-bar']),
					pseudo: new Set([':hover']),
				},
			},
		]);

		// Overlap of IDs
		expect(
			mergeSelectorParts([
				{
					parents: [
						{
							name: new Set(['.animate-on-focus']),
							pseudo: new Set([':focus-within']),
						},
					],
					svg: {
						id: '#foo',
					},
				},
				{
					parents: [
						{
							name: new Set(['.animate-on-hover']),
							pseudo: new Set([':hover']),
						},
					],
					svg: {
						id: '#bar',
					},
				},
			])
		).toBeNull();
	});

	test('Stringify selector parts', () => {
		// Simple selector
		expect(
			stringifySelectorParts([
				{
					at: ['@media (max-width: 600px)'],
					parents: [
						{
							tag: 'input',
							pseudo: new Set([':focus']),
						},
					],
					svg: {
						name: new Set(['.foo']),
						pseudo: new Set([':hover']),
					},
				},
			])
		).toEqual([
			'@media (max-width: 600px)',
			'input:focus',
			'svg.foo:hover',
		]);

		// Multiple parent selectors
		expect(
			stringifySelectorParts([
				{
					at: ['@media (max-width: 600px)'],
					parents: [
						{
							tag: 'input',
							pseudo: new Set([':focus']),
						},
					],
					svg: {
						name: new Set(['.foo']),
					},
				},
				{
					at: ['@media (max-width: 600px)'],
					parents: [
						{
							tag: 'label',
							pseudo: new Set([':focus']),
						},
					],
					svg: {
						name: new Set(['.foo']),
					},
				},
			])
		).toEqual([
			'@media (max-width: 600px)',
			'input:focus, label:focus',
			'svg.foo',
		]);
	});

	test('Split state selector', () => {
		// 3 sets of data: one set for 2 parent selectors, one set for :hover, one set for :focus
		expect(
			splitSelectorsForState(
				'.hover-trigger:hover, .focus-trigger:focus, &:hover, &:focus'
			)
		).toEqual([
			// Set 1
			[
				{
					parents: [
						{
							name: new Set(['.hover-trigger']),
							pseudo: new Set([':hover']),
						},
					],
				},
				{
					parents: [
						{
							name: new Set(['.focus-trigger']),
							pseudo: new Set([':focus']),
						},
					],
				},
			],
			// Set 2
			[{ svg: { pseudo: new Set([':hover']) } }],
			// Set 3
			[{ svg: { pseudo: new Set([':focus']) } }],
		]);
	});

	test('Merge selectors for states', () => {
		// Split
		const focusState = splitSelectorsForState(
			'.hover-trigger:hover, .focus-trigger:focus, &:focus'
		);
		const animatedState = splitSelectorsForState(
			'.animate-on-focus:focus, .animate-on-hover:hover'
		);
		if (!focusState || !animatedState) {
			throw new Error('Failed to split selectors for states');
		}

		// Merge
		const merged = mergeSelectorsForStates([focusState, animatedState]);
		expect(merged).not.toBeNull();

		// Map to strings for simple assertion
		const result = merged!.map((group) => stringifySelectorParts(group));
		expect(result).toEqual([
			[
				// Group 1: all combinations of parent selectors
				[
					'.animate-on-focus:focus .focus-trigger:focus',
					'.animate-on-focus:focus .hover-trigger:hover',
					'.animate-on-focus.focus-trigger:focus',
					'.animate-on-focus.hover-trigger:focus:hover',
					'.animate-on-hover:hover .focus-trigger:focus',
					'.animate-on-hover:hover .hover-trigger:hover',
					'.animate-on-hover.focus-trigger:focus:hover',
					'.animate-on-hover.hover-trigger:hover',
					'.focus-trigger:focus .animate-on-focus:focus',
					'.focus-trigger:focus .animate-on-hover:hover',
					'.hover-trigger:hover .animate-on-focus:focus',
					'.hover-trigger:hover .animate-on-hover:hover',
				].join(', '),
			],
			// Group 2: parent from second state + SVG pseudo :focus
			['.animate-on-focus:focus, .animate-on-hover:hover', 'svg:focus'],
		]);

		// Stringify with opimisation
		expect(stringifySelectorsForState(merged!)).toEqual([
			[
				[
					// Group 1: all combinations of parent selectors
					'.animate-on-focus:focus .focus-trigger:focus',
					'.animate-on-focus:focus .hover-trigger:hover',
					'.animate-on-focus.focus-trigger:focus',
					'.animate-on-focus.hover-trigger:focus:hover',
					'.animate-on-hover:hover .focus-trigger:focus',
					'.animate-on-hover:hover .hover-trigger:hover',
					'.animate-on-hover.focus-trigger:focus:hover',
					'.animate-on-hover.hover-trigger:hover',
					'.focus-trigger:focus .animate-on-focus:focus',
					'.focus-trigger:focus .animate-on-hover:hover',
					'.hover-trigger:hover .animate-on-focus:focus',
					'.hover-trigger:hover .animate-on-hover:hover',
					// Group 2: parent from second state + SVG pseudo :focus
					'.animate-on-focus:focus svg:focus',
					'.animate-on-hover:hover svg:focus',
				]
					.sort((a, b) => a.localeCompare(b))
					.join(', '),
			],
		]);
	});

	test('Merge selectors for states (svg states)', () => {
		// Split
		const focusState = splitSelectorsForState('&:focus');
		const animatedState = splitSelectorsForState('&.animated');
		const testState = splitSelectorsForState('&.state-test');
		if (!focusState || !animatedState || !testState) {
			throw new Error('Failed to split selectors for states');
		}

		// Merge
		const merged = mergeSelectorsForStates([
			focusState,
			animatedState,
			testState,
		]);
		expect(merged).not.toBeNull();

		// Map to strings for simple assertion
		const result = merged!.map((group) => stringifySelectorParts(group));
		expect(result).toEqual([['svg.animated.state-test:focus']]);

		// Stringify with opimisation
		expect(stringifySelectorsForState(merged!)).toEqual([
			['svg.animated.state-test:focus'],
		]);
	});

	test('Merge selectors for states with combinator', () => {
		// Split
		const state1 = splitSelectorsForState('.foo');
		const state2 = splitSelectorsForState('.bar + .baz');
		if (!state1 || !state2) {
			throw new Error('Failed to split selectors for states');
		}

		// Merge
		const merged = mergeSelectorsForStates([state1, state2]);
		expect(merged).not.toBeNull();

		// Map to strings for simple assertion
		const result = merged!.map((group) => stringifySelectorParts(group));
		expect(result).toEqual([
			[
				[
					'.bar .foo + .baz', // Bad selector, but checking this would require more complex logic
					'.bar + .baz .foo',
					'.bar + .baz.foo',
					'.bar.foo + .baz',
					'.foo .bar + .baz',
				].join(', '),
			],
		]);
	});

	test('Stringify selectors for state', () => {
		// Nothing to do
		expect(
			stringifySelectorsForState(
				splitSelectorsForState(
					'.hover-trigger:hover, .focus-trigger:focus, &:focus'
				)!
			)
		).toEqual([['.focus-trigger:focus, .hover-trigger:hover, svg:focus']]);

		// Cannot optimise
		expect(
			stringifySelectorsForState([
				...splitSelectorsForState(
					'@media (min-width: 768px) :hover &:focus'
				)!,
				...splitSelectorsForState(
					'@media (min-width: 320px) :hover &:focus'
				)!,
			])
		).toEqual([
			['@media (min-width: 768px)', '*:hover', 'svg:focus'],
			['@media (min-width: 320px)', '*:hover', 'svg:focus'],
		]);

		// Join as is
		expect(
			stringifySelectorsForState([
				...splitSelectorsForState('&:focus')!,
				...splitSelectorsForState('&:hover')!,
			])
		).toEqual([['svg:focus, svg:hover']]);
		expect(
			stringifySelectorsForState([
				...splitSelectorsForState(':focus')!,
				...splitSelectorsForState(':hover')!,
			])
		).toEqual([['*:focus, *:hover']]);

		// Common chunk at start
		expect(
			stringifySelectorsForState([
				...splitSelectorsForState('.foo :focus')!,
				...splitSelectorsForState('.foo :hover')!,
			])
		).toEqual([['.foo', '*:focus, *:hover']]);

		// Common chunk at end
		expect(
			stringifySelectorsForState([
				...splitSelectorsForState('.bar :hover')!,
				...splitSelectorsForState('.foo :hover')!,
			])
		).toEqual([['.bar, .foo', '*:hover']]);

		// Common chunk in middle
		expect(
			stringifySelectorsForState([
				...splitSelectorsForState('.test .foo :hover')!,
				...splitSelectorsForState('.test1 .test2 .foo :focus')!,
			])
		).toEqual([['.test, .test1 .test2', '.foo', '*:focus, *:hover']]);
	});

	test('Full cycle', () => {
		const context = createStatefulIconSelectorsContext(
			{
				focus: '.hover-trigger:hover, .focus-trigger:focus, &:focus',
				align: '.state-{state}',
			},
			['focus', ['align', ['left', 'center', 'right']]]
		);
		expect(getSelectorsForStateValues(context, {})).toEqual([[]]);

		// Focus state
		expect(
			getSelectorsForStateValues(context, {
				focus: true,
			})
		).toEqual([['.focus-trigger:focus, .hover-trigger:hover, svg:focus']]);
		expect(
			getSelectorsForStateValues(context, {
				focus: false,
			})
		).toEqual([[]]);

		expect(getSelectorsForStateValues(context, 'focus')).toEqual([
			['.focus-trigger:focus, .hover-trigger:hover, svg:focus'],
		]);

		// Align state
		expect(
			getSelectorsForStateValues(context, {
				align: 'center',
			})
		).toEqual([['.state-center']]);
		expect(
			getSelectorsForStateValues(context, {
				align: 'left',
			})
		).toEqual([[]]);

		// Mixed states
		expect(
			getSelectorsForStateValues(context, {
				focus: false,
				align: 'left',
			})
		).toEqual([[]]);
		expect(
			getSelectorsForStateValues(context, {
				focus: true,
				align: 'right',
			})
		).toEqual([
			[
				[
					'.focus-trigger:focus .state-right',
					'.focus-trigger.state-right:focus',
					'.hover-trigger:hover .state-right',
					'.hover-trigger.state-right:hover',
					'.state-right .focus-trigger:focus',
					'.state-right .hover-trigger:hover',
					'.state-right svg:focus',
				].join(', '),
			],
		]);

		expect(getSelectorsForStateValues(context, 'right_focus')).toEqual([
			[
				[
					'.focus-trigger:focus .state-right',
					'.focus-trigger.state-right:focus',
					'.hover-trigger:hover .state-right',
					'.hover-trigger.state-right:hover',
					'.state-right .focus-trigger:focus',
					'.state-right .hover-trigger:hover',
					'.state-right svg:focus',
				].join(', '),
			],
		]);

		// Bad state
		expect(
			getSelectorsForStateValues(context, {
				test: true,
			})
		).toBeNull();

		// Bad state value
		expect(
			getSelectorsForStateValues(context, {
				align: true,
			})
		).toBeNull();
	});
});
