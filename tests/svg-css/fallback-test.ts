import { cleanupStateValues } from '../../src/svg-css/states/cleanup-values.js';
import { getIconFallback } from '../../src/svg-css/states/fallback/stringify.js';
import { parseAndTestIconFallbackTemplate } from '../../src/svg-css/states/fallback/test.js';
import type { IconStatesList } from '../../src/svg-css/states/types.js';

describe('Testing fallback template', () => {
	test('Boolean states', () => {
		const tempalte1 = parseAndTestIconFallbackTemplate(
			'arrow-{action?left|right}',
			['action', 'focus']
		);
		expect(tempalte1).toEqual([
			'arrow-',
			{
				state: 'action',
				values: ['right', 'left'],
			},
		]);

		// Test fallback generation
		expect(getIconFallback(tempalte1!, { action: true })).toBe(
			'arrow-left'
		);
		expect(getIconFallback(tempalte1!, { action: false })).toBe(
			'arrow-right'
		);
		expect(getIconFallback(tempalte1!, {})).toBe('arrow-right');
		expect(getIconFallback(tempalte1!, { action: 'bad-value' })).toBe(
			'arrow-left'
		);

		// Template starts and ends with same state
		const tempalte2 = parseAndTestIconFallbackTemplate(
			"{light?'mdi-light:arrow-left'|'mdi:arrow-left'}",
			['light']
		);
		expect(tempalte2).toEqual([
			{
				state: 'light',
				values: ['mdi:arrow-left', 'mdi-light:arrow-left'],
			},
		]);

		// Action state with quotes
		expect(
			parseAndTestIconFallbackTemplate(
				`chevrons-bar{action?''|'-to'}-horizontal`,
				['action', 'focus']
			)
		).toEqual([
			'chevrons-bar',
			{ state: 'action', values: ['-to', ''] },
			'-horizontal',
		]);

		// Bad templates
		expect(
			// Missing }
			parseAndTestIconFallbackTemplate('arrow-{action?left|right', [
				'action',
			])
		).toBeUndefined();
		expect(
			// No such state
			parseAndTestIconFallbackTemplate('arrow-{action?left|right}', [
				'focus',
			])
		).toBeUndefined();
		expect(
			// Invalid quotes placement
			parseAndTestIconFallbackTemplate("arrow-{action?'left|right'}", [
				'action',
			])
		).toBeUndefined();
		expect(
			// Invalid number of values
			parseAndTestIconFallbackTemplate('arrow-{action}', ['action'])
		).toBeUndefined();
		expect(
			// Invalid number of values
			parseAndTestIconFallbackTemplate('arrow-{action?left}', ['action'])
		).toBeUndefined();
		expect(
			// Invalid number of values
			parseAndTestIconFallbackTemplate(
				'arrow-{action?left|right|center}',
				['action']
			)
		).toBeUndefined();
	});

	test('Advanced state', () => {
		const alignStates: IconStatesList = [
			['horizontal', ['left', 'center', 'right']],
			['vertical', ['top', 'middle', 'bottom'], 'middle'],
		];

		const tempalte1 = parseAndTestIconFallbackTemplate(
			'box-horizontal-{horizontal}-{vertical}',
			alignStates
		);
		expect(tempalte1).toEqual([
			'box-horizontal-',
			{
				state: 'horizontal',
			},
			'-',
			{
				state: 'vertical',
			},
		]);

		// Test fallback generation
		expect(
			getIconFallback(tempalte1!, { horizontal: 'left', vertical: 'top' })
		).toBe('box-horizontal-left-top');
		expect(
			getIconFallback(tempalte1!, {
				horizontal: 'right',
				vertical: 'middle',
			})
		).toBe('box-horizontal-right-middle');

		// Missing values: should generate bad values, but should not fail
		// Validation of values object should be done separately in cleanupStateValues()
		expect(getIconFallback(tempalte1!, {})).toBe('box-horizontal--');
		expect(
			getIconFallback(tempalte1!, cleanupStateValues(alignStates, {}))
		).toBe('box-horizontal-left-middle');
	});
});
