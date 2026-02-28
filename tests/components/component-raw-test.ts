import { convertIconifyIconToFactoryContent } from '../../src/components/prepare/iconify.js';
import { createRawComponent } from '../../src/components/raw.js';
import { componentFactoryFileSystemOptions } from '../../src/components/prepare/options.js';
import type { FactoryIconData } from '../../src/components/types/data.js';
import { createUniqueHashContext } from '../../src/helpers/hash/context.js';
import { stringifyStylesheet } from '../../src/css/stylesheet.js';
import { prepareComponentFactoryStatefulIcon } from '../../src/components/prepare/states.js';

describe('Creating raw components', () => {
	it('Simple icon', () => {
		const context = createUniqueHashContext();
		const options = componentFactoryFileSystemOptions({});
		const data: FactoryIconData = {
			prefix: 'test',
			name: 'icon',
			icon: {
				viewBox: {
					width: 24,
					height: 24,
				},
				content:
					'<path d="M0 0l24 24" stroke="currentColor" fill="none" />',
			},
		};
		const result = createRawComponent(data, {
			context,
			...options,
			cssMode: 'import',
		});
		expect(result.content).toBe(
			'const icon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0l24 24" stroke="currentColor" fill="none" /></svg>`;\n\nexport default icon;\n'
		);
		expect(result.assets).toHaveLength(1);
		expect(result.assets[0].filename).toBe('i/icon.d.ts');
		expect(result.style).toBeUndefined();
	});

	it('Icon with CSS', () => {
		const context = createUniqueHashContext();
		const options = componentFactoryFileSystemOptions({
			doubleDirsForCSS: false,
			doubleDirsForComponents: false,
		});

		// Convert IconifyIcon and test it
		const data = convertIconifyIconToFactoryContent(
			{
				body: '<path d="M0 0l16 16" fill="currentColor" />',
			},
			'test-prefix',
			'line-icon',
			{ context }
		);
		expect(data.prefix).toBe('test-prefix');
		expect(data.name).toBe('line-icon');
		expect(data.icon.viewBox).toEqual({
			left: 0,
			top: 0,
			width: 16,
			height: 16,
		});

		// Fallback should be set, but will be ignored
		expect(data.icon.defaultFallback).toEqual('test-prefix:line-icon');

		// Get class name
		const classNames = Object.keys(data.icon.classes ?? {});
		expect(classNames).toHaveLength(1);
		const testClassName = classNames[0];

		// Generate component
		const result = createRawComponent(data, {
			context,
			...options,
			cssMode: 'import',
			height: '1em',
		});
		expect(result.content).toBe(
			`import './css/${testClassName}.css';\n\n` +
				'const icon = `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16"><path class="' +
				testClassName +
				'"/></svg>`;\n\nexport default icon;\n'
		);
		expect(result.assets).toHaveLength(2);
		expect(result.assets[0].filename).toBe(`css/${testClassName}.css`);
		expect(result.assets[1].filename).toBe('line-icon.d.ts');
		expect(result.style).toBeUndefined();
	});

	it('Icon with CSS', () => {
		const context = createUniqueHashContext();
		const options = componentFactoryFileSystemOptions({
			doubleDirsForCSS: false,
			doubleDirsForComponents: false,
		});

		// Convert IconifyIcon and test it
		const data = convertIconifyIconToFactoryContent(
			{
				body: '<path d="M0 0l16 16" fill="currentColor" />',
			},
			'test-prefix',
			'line-icon',
			{ context }
		);
		expect(data.prefix).toBe('test-prefix');
		expect(data.name).toBe('line-icon');
		expect(data.icon.viewBox).toEqual({
			left: 0,
			top: 0,
			width: 16,
			height: 16,
		});

		// Fallback should be set, but will be ignored
		expect(data.icon.defaultFallback).toEqual('test-prefix:line-icon');

		// Get class name
		const classNames = Object.keys(data.icon.classes ?? {});
		expect(classNames).toHaveLength(1);
		const testClassName = classNames[0];

		// Generate component
		const result = createRawComponent(data, {
			context,
			...options,
			cssMode: 'import',
			height: '1em',
		});
		expect(result.content).toBe(
			`import './css/${testClassName}.css';\n\n` +
				'const icon = `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16"><path class="' +
				testClassName +
				'"/></svg>`;\n\nexport default icon;\n'
		);
		expect(result.assets).toHaveLength(2);
		expect(result.assets[0].filename).toBe(`css/${testClassName}.css`);
		expect(result.assets[1].filename).toBe('line-icon.d.ts');
		expect(result.style).toBeUndefined();
	});

	it('Icon with CSS, separate file', () => {
		const context = createUniqueHashContext();
		const options = componentFactoryFileSystemOptions({
			doubleDirsForCSS: false,
			doubleDirsForComponents: false,
		});

		// Convert IconifyIcon and test it
		const data = convertIconifyIconToFactoryContent(
			{
				body: '<path d="M0 0l16 16" fill="currentColor" />',
			},
			'test-prefix',
			'line-icon',
			{ context }
		);
		expect(data.prefix).toBe('test-prefix');
		expect(data.name).toBe('line-icon');
		expect(data.icon.viewBox).toEqual({
			left: 0,
			top: 0,
			width: 16,
			height: 16,
		});

		// Fallback should be set, but will be ignored
		expect(data.icon.defaultFallback).toEqual('test-prefix:line-icon');

		// Get class name
		const classNames = Object.keys(data.icon.classes ?? {});
		expect(classNames).toHaveLength(1);
		const testClassName = classNames[0];

		// Generate component
		const result = createRawComponent(data, {
			context,
			...options,
			cssMode: 'prop',
		});
		expect(result.content).toBe(
			'const icon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path class="' +
				testClassName +
				'"/></svg>`;\n\nexport default icon;\n'
		);
		expect(result.assets).toHaveLength(1);
		expect(result.assets[0].filename).toBe('line-icon.d.ts');
		expect(
			result.style ? stringifyStylesheet(result.style) : undefined
		).toBe(
			`.${testClassName} {\n  d: path("M0 0l16 16");\n  fill: currentColor;\n}\n`
		);
	});

	it('Icon with CSS, embedded', () => {
		const context = createUniqueHashContext();
		const options = componentFactoryFileSystemOptions({
			doubleDirsForCSS: false,
			doubleDirsForComponents: false,
		});

		// Convert IconifyIcon and test it
		const data = convertIconifyIconToFactoryContent(
			{
				body: '<path d="M0 0l16 16" fill="currentColor" />',
			},
			'test-prefix',
			'line-icon',
			{ context }
		);
		expect(data.prefix).toBe('test-prefix');
		expect(data.name).toBe('line-icon');
		expect(data.icon.viewBox).toEqual({
			left: 0,
			top: 0,
			width: 16,
			height: 16,
		});

		// Fallback should be set, but will be ignored
		expect(data.icon.defaultFallback).toEqual('test-prefix:line-icon');

		// Get class name
		const classNames = Object.keys(data.icon.classes ?? {});
		expect(classNames).toHaveLength(1);
		const testClassName = classNames[0];

		// Generate component
		const result = createRawComponent(data, {
			context,
			...options,
			cssMode: 'embed',
		});
		expect(result.content).toBe(
			'const icon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><style>.' +
				testClassName +
				' {\n  d: path("M0 0l16 16");\n  fill: currentColor;\n}\n</style><path class="' +
				testClassName +
				'"/></svg>`;\n\nexport default icon;\n'
		);
		expect(result.assets).toHaveLength(1);
		expect(result.assets[0].filename).toBe('line-icon.d.ts');
		expect(result.style).toBeUndefined();
	});

	it('Stateful icon (has no effect)', () => {
		const context = createUniqueHashContext();
		const options = componentFactoryFileSystemOptions({});

		// Convert SVGCSSStatefulIcon
		const icon = prepareComponentFactoryStatefulIcon({
			viewBox: '0 0 22 24',
			content:
				'<path class="fabh7v mfq4_u ona74n"/><path class="ek9rqv mfxbmu ona74n"/>',
			fallback: 'animated-line-24:align-box-{halign}-{valign}',
			states: [
				['halign', ['left', 'center', 'right']],
				['valign', ['top', 'middle', 'bottom', 'stretch']],
				'focus',
			],
			keyframes: {
				'so-from-74': '0%{stroke-dashoffset:74}',
				'so-to-0': '100%{stroke-dashoffset:0}',
			},
			animations: {
				fabh7v: 'stroke-dasharray:74;animation:0.6s linear forwards so-from-74;',
				ek9rqv: 'stroke-dasharray:10;stroke-dashoffset:10;animation:0.2s linear 0.7s forwards so-to-0;',
			},
			classes: {
				ona74n: 'stroke-linecap:round;stroke-linejoin:round;stroke-width:var(--svg-stroke-width, 1.5px);fill:none;',
				mfq4_u: "d:path('M11 3h8c0.5 0 1 0.5 1 1v16c0 0.5 -0.5 1 -1 1h-16c-0.5 0 -1 -0.5 -1 -1v-16c0 -0.5 0.5 -1 1 -1Z');stroke:var(--svg-tertiary-color, currentColor);",
				mfxbmu: "stroke:var(--svg-primary-color, currentColor);d:path('M6 7h4M6 10.5h8M6 14h6');",
			},
			statefulClasses: {
				mfq4_u: {
					stateRules: {
						focus: "d:path('M11 3h9c0 0 0 0 0 0v18c0 0 0 0 0 0h-18c0 0 0 0 0 0v-18c0 0 0 0 0 0Z');",
					},
					transition: 'transition:d 0.4s linear;',
				},
				mfxbmu: {
					stateRules: {
						focus: "d:path('M5 6h8M5 9h8M5 12h8');",
						middle: "d:path('M6 8.5h4M6 12h8M6 15.5h6');",
						middle_focus: "d:path('M5 9h8M5 12h8M5 15h8');",
						bottom: "d:path('M6 10h4M6 13.5h8M6 17h6');",
						bottom_focus: "d:path('M5 12h8M5 15h8M5 18h8');",
						stretch: "d:path('M6 7h4M6 12h8M6 17h6');",
						stretch_focus: "d:path('M5 6h8M5 12h8M5 18h8');",
						center: "d:path('M9 7h4M7 10.5h8M8 14h6');",
						center_focus: "d:path('M7 6h8M7 9h8M7 12h8');",
						center_middle: "d:path('M9 8.5h4M7 12h8M8 15.5h6');",
						center_middle_focus: "d:path('M7 9h8M7 12h8M7 15h8');",
						center_bottom: "d:path('M9 10h4M7 13.5h8M8 17h6');",
						center_bottom_focus: "d:path('M7 12h8M7 15h8M7 18h8');",
						center_stretch: "d:path('M9 7h4M7 12h8M8 17h6');",
						center_stretch_focus: "d:path('M7 6h8M7 12h8M7 18h8');",
						right: "d:path('M12 7h4M8 10.5h8M10 14h6');",
						right_focus: "d:path('M9 6h8M9 9h8M9 12h8');",
						right_middle: "d:path('M12 8.5h4M8 12h8M10 15.5h6');",
						right_middle_focus: "d:path('M9 9h8M9 12h8M9 15h8');",
						right_bottom: "d:path('M12 10h4M8 13.5h8M10 17h6');",
						right_bottom_focus: "d:path('M9 12h8M9 15h8M9 18h8');",
						right_stretch: "d:path('M12 7h4M8 12h8M10 17h6');",
						right_stretch_focus: "d:path('M9 6h8M9 12h8M9 18h8');",
					},
					transition: 'transition:d 0.4s linear;',
				},
			},
		})!;
		expect(icon).toBeTruthy();
		const data: FactoryIconData = {
			prefix: 'test',
			name: 'icon',
			icon,
		};
		expect(data.icon.defaultFallback).toBe(
			'animated-line-24:align-box-left-top'
		);

		// Generate component
		const result = createRawComponent(data, {
			context,
			...options,
			cssMode: 'import',
		});

		// console.log(result.content);
		// Should not contain any stateful data: requires manually toggling class names SVG
		expect(result.content).toContain(
			'const icon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 24"><path class="fabh7v mfq4_u ona74n"/><path class="ek9rqv mfxbmu ona74n"/></svg>`;'
		);
	});
});
