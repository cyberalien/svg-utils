import { findUsedKeyframes } from '../../src/css/find/animations.js';
import { findUsedClassNames } from '../../src/css/find/classname.js';
import { findCSSPropertyValues } from '../../src/css/find/prop.js';

describe('Find properties in content', () => {
	test('Class names', () => {
		expect(findUsedClassNames('<div />')).toEqual([]);
		expect(findUsedClassNames('<div class="foo bar" />')).toEqual([
			'foo',
			'bar',
		]);
		expect(
			findUsedClassNames('<div class="foo bar" />\n<div class="baz" />')
		).toEqual(['foo', 'bar', 'baz']);
	});

	test('Property values', () => {
		expect(
			findCSSPropertyValues(
				'stroke-dasharray:4;stroke-dashoffset:4;animation:0.4s linear 2.2s forwards so-to-0;',
				'stroke-dasharray'
			)
		).toEqual(['4']);
		expect(
			findCSSPropertyValues(
				'stroke-dasharray:4;stroke-dashoffset:4;animation : 0.4s linear 2.2s forwards\nso-to-0 ;',
				'animation'
			)
		).toEqual(['0.4s linear 2.2s forwards\nso-to-0']);
		expect(
			findCSSPropertyValues(
				'animation:0.4s linear 2.2s forwards so-to-0;animation-name:foo, bar;',
				'animation-name'
			)
		).toEqual(['foo', 'bar']);
	});

	test('Find animation names', () => {
		expect(
			findUsedKeyframes(
				'animation:0.4s linear 2.2s forwards so-to-0;animation-name:foo, bar;'
			)
		).toEqual(['foo', 'bar', 'so-to-0']);

		expect(
			findUsedKeyframes(
				'animation:2s cubic-bezier(0.42, 0, 0.58, 1) infinite d-fj3glb;'
			)
		).toEqual(['d-fj3glb']);
		expect(
			findUsedKeyframes(
				'-webkit-animation:0.3s linear 0.5s forwards so-to-0, 0.3s linear 1.2s forwards transform-n4tdof;'
			)
		).toEqual(['so-to-0', 'transform-n4tdof']);
	});
});
