/* eslint-disable @typescript-eslint/no-unused-vars */
import { convertGeneratedComponentToFile } from '../../src/components/export/file.js';
import { saveExportedFilesToFS } from '../../src/components/export/fs.js';
import { mergeExportedComponentFiles } from '../../src/components/export/merge.js';
import { createJSXComponent } from '../../src/components/jsx.js';
import { componentFactoryFileSystemOptions } from '../../src/components/prepare/options.js';
import { prepareComponentFactoryStatefulIcon } from '../../src/components/prepare/states.js';
import { createSvelteComponent } from '../../src/components/svelte.js';
import type { FactoryIconData } from '../../src/components/types/data.js';
import type { ComponentFactoryFileSystemOptions } from '../../src/components/types/options.js';
import { createVueComponent } from '../../src/components/vue.js';
import {
	createUniqueHashContext,
	type SVGCSSStatefulIcon,
} from '../../src/index.js';

// align-box-horizontal
const icon1: SVGCSSStatefulIcon = {
	viewBox: '0 0 22 24',
	content: '<path class="ona74n u2mluk"/><path class="b6dtxa ona74n"/>',
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
	classes: {
		u2mluk: "d:path('M11 3h8c0.5 0 1 0.5 1 1v16c0 0.5 -0.5 1 -1 1h-16c-0.5 0 -1 -0.5 -1 -1v-16c0 -0.5 0.5 -1 1 -1Z');stroke:var(--svg-tertiary-color, currentColor);",
		ona74n: 'stroke-linecap:round;stroke-linejoin:round;stroke-width:var(--svg-stroke-width, 1.5px);fill:none;',
		b6dtxa: "stroke:var(--svg-primary-color, currentColor);d:path('M6 7h4M6 10.5h8M6 14h6');",
	},
	animations: {
		u2mluk: 'stroke-dasharray:74;animation:0.6s linear forwards so-from-74;',
		b6dtxa: 'stroke-dasharray:10;stroke-dashoffset:10;animation:0.2s linear 0.7s forwards so-to-0;',
	},
	statefulClasses: {
		u2mluk: {
			stateRules: {
				focus: "d:path('M11 3h9c0 0 0 0 0 0v18c0 0 0 0 0 0h-18c0 0 0 0 0 0v-18c0 0 0 0 0 0Z');",
			},
			transition: 'transition:d 0.4s linear;',
		},
		b6dtxa: {
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
};

// remove-to-search
const icon2: SVGCSSStatefulIcon = {
	viewBox: '0 0 20 24',
	content:
		'<defs><mask id="SVGRErrZbBT"><path class="ae-3qn g_1xrq p10gmg"/><path class="g_1xrq objeeb zs6nhs"/></mask></defs><path mask="url(#SVGRErrZbBT)" class="mbb8cl"/><path class="a8wtkc g_1xrq p10gmg zs6nhs"/>',
	fallback: 'animated-line-24:{action?search|remove}',
	states: ['action', 'focus'],
	classes: {
		'g_1xrq': 'stroke-linecap:round;stroke-linejoin:round;',
		'zs6nhs':
			"d:path('M17 19c0 0 -7 -7 -7 -7c0 0 -7 -7 -7 -7c0 0 7 7 7 7c0 0 7 7 7 7Z');",
		'a8wtkc': 'stroke:var(--svg-primary-color, currentColor);',
		'p10gmg': 'stroke-width:var(--svg-stroke-width, 1.5px);fill:none;',
		'ae-3qn': "d:path('M17 5l-14 14M17 19l0 0');stroke:#fff;",
		'objeeb':
			'stroke-width:var(--svg-mask-width, calc(var(--svg-stroke-width, 1.5px) + 1px));fill:#000;stroke:#000;',
		'mbb8cl':
			"fill:var(--svg-secondary-color, currentColor);d:path('M0 0h20v24H0z');",
	},
	statefulClasses: {
		'zs6nhs': {
			stateRules: {
				focus: "d:path('M18 20c0 0 -8 -8 -8 -8c0 0 -8 -8 -8 -8c0 0 8 8 8 8c0 0 8 8 8 8Z');",
				action: "d:path('M11.4 13.4c-2.16 2.14 -5.64 2.14 -7.79 -0.01c-2.15 -2.15 -2.15 -5.63 0 -7.78c2.15 -2.15 5.63 -2.15 7.78 0c2.15 2.15 2.15 5.63 0 7.78Z');",
				action_focus:
					"d:path('M11.74 13.74c-2.34 2.35 -6.14 2.35 -8.48 0c-2.35 -2.34 -2.35 -6.14 0 -8.48c2.34 -2.35 6.14 -2.35 8.48 0c2.35 2.34 2.35 6.14 0 8.48Z');",
			},
			transition: 'transition:d 0.4s linear;',
		},
		'ae-3qn': {
			stateRules: {
				focus: "d:path('M18 4l-16 16M18 20l0 0');",
				action: "d:path('M11.5 13.5l0 0M11.5 13.5l6.5 6.5');",
				action_focus: "d:path('M11 14.4l0 0M11 14.4l6 7.6');",
			},
			transition: 'transition:d 0.4s linear;',
		},
	},
};

// light-dark
const icon3: SVGCSSStatefulIcon = {
	viewBox: '0 0 24 24',
	content:
		'<defs><mask id="SVG5vqpYcTc"><path class="mc7__g reacnl"/><path class="iy2otu r1menc sh2p6x zxndow"/><path class="iy2otu r1menc rg1nfv zxndow"/><path class="l-actj nf43cj"/><path class="al390y ia15ro r1menc"/></mask><mask id="SVG5lwb9bGv"><path class="mc7__g omafcw"/><path class="df7-9f iy2otu r1menc zxndow"/><path class="c807hd nf43cj"/><path class="al390y ia15ro r1menc"/></mask><mask id="SVG0TyOKeaR"><path class="iy2otu r1menc td9rkk zxndow"/><path class="iy2otu r1menc t50njl zxndow"/><path class="c807hd nf43cj"/><path class="al390y ia15ro r1menc"/></mask></defs><path mask="url(#SVG5vqpYcTc)" class="lsejuv z3aezd"/><path mask="url(#SVG5lwb9bGv)" class="lsejuv z3aezd"/><path mask="url(#SVG0TyOKeaR)" class="b9a3-f lsejuv"/><path class="ia15ro iy2otu r1menc zcx7gx"/>',
	fallback: 'animated-line-24:color-scheme-{mode}-{fill}',
	states: [
		['mode', ['auto', 'light', 'dark']],
		['fill', ['no-fill', 'light-filled', 'dark-filled', 'filled']],
		'focus',
	],
	keyframes: {
		'fade-to-1': '100%{opacity:1}',
		'so-from-28': '0%{stroke-dashoffset:28}',
		'so-from-44': '0%{stroke-dashoffset:44}',
		'so-from-18': '0%{stroke-dashoffset:18}',
		'so-from-34': '0%{stroke-dashoffset:34}',
		'so-to-0': '100%{stroke-dashoffset:0}',
	},
	classes: {
		'reacnl':
			"d:path('M9.88 2.75h-0.38c-3.73 0 -6.75 3.02 -6.75 6.75c0 3.73 3.02 6.75 6.75 6.75c2.7 0 5.05 -1.6 6.12 -3.9c-2.6 1.2 -5.75 0.3 -7.25 -2.29c-1.43 -2.51 -0.75 -5.62 1.5 -7.31Z');fill-opacity:0;",
		'zxndow': 'stroke:#fff;',
		'iy2otu': 'stroke-width:var(--svg-stroke-width, 1.5px);',
		'l-actj': "d:path('M24 0h24v24h-48Z');",
		'nf43cj': 'fill:#000;',
		'omafcw':
			"d:path('M14.5 10.75c2.07 0 3.75 1.68 3.75 3.75c0 2.07 -1.68 3.75 -3.75 3.75c-2.07 0 -3.75 -1.68 -3.75 -3.75c0 -2.07 1.68 -3.75 3.75 -3.75Z');fill-opacity:0;",
		'c807hd': "d:path('M24 0h-48v24h24Z');",
		'lsejuv': "d:path('M0 0h24v24H0z');",
		'z3aezd': 'fill:var(--svg-primary-color, currentColor);',
		'b9a3-f': 'fill:var(--svg-secondary-color, currentColor);',
		'zcx7gx': 'stroke:var(--svg-tertiary-color, currentColor);',
		'mc7__g': 'fill:#fff;',
		'r1menc': 'stroke-linecap:round;stroke-linejoin:round;fill:none;',
		'sh2p6x':
			"d:path('M9.88 2.75c-2.25 1.69 -2.93 4.8 -1.5 7.31c1.5 2.59 4.65 3.49 7.25 2.29');",
		'rg1nfv':
			"d:path('M9.88 2.75h-0.38c-3.73 0 -6.75 3.02 -6.75 6.75c0 3.73 3.02 6.75 6.75 6.75c2.7 0 5.05 -1.6 6.12 -3.9');",
		'al390y':
			'stroke-width:var(--svg-mask-width, calc(var(--svg-stroke-width, 1.5px) + 1px));stroke:#000;',
		'ia15ro': "d:path('M12 12l10 -10M12 12l-10 10');",
		'df7-9f':
			"d:path('M14.5 10.75c2.07 0 3.75 1.68 3.75 3.75c0 2.07 -1.68 3.75 -3.75 3.75c-2.07 0 -3.75 -1.68 -3.75 -3.75c0 -2.07 1.68 -3.75 3.75 -3.75Z');",
		'td9rkk':
			"d:path('M14.5 7.75v-0.75M14.5 21.25v0.75M7.75 14.5h-0.75M21.25 14.5h0.75');",
		't50njl':
			"d:path('M9.63 9.63l-0.38 -0.38M9.63 19.38l-0.38 0.38M19.38 9.63l0.38 -0.38M19.38 19.38l0.38 0.38');",
	},
	statefulClasses: {
		'reacnl': {
			stateRules: {
				'focus':
					"d:path('M9.13 2h0c-3.9 0.26 -7.13 3.53 -7.13 7.5c0 4.14 3.36 7.5 7.5 7.5c2.7 0 5.05 -1.63 6.38 -3.75c-3.08 1.3 -6.75 0.38 -8.48 -2.63c-1.65 -2.93 -0.8 -6.56 1.73 -8.63Z');",
				'dark': "d:path('M12.5 3h-0.5c-4.97 0 -9 4.03 -9 9c0 4.97 4.03 9 9 9c3.6 0 6.73 -2.13 8.16 -5.2c-3.46 1.6 -7.66 0.4 -9.66 -3.05c-1.9 -3.35 -1 -7.49 2 -9.75Z');",
				'dark_focus':
					"d:path('M11.5 2h0c-5.2 0.35 -9.5 4.7 -9.5 10c0 5.52 4.48 10 10 10c3.6 0 6.73 -2.18 8.5 -5c-4.1 1.73 -9 0.5 -11.3 -3.5c-2.2 -3.9 -1.07 -8.75 2.3 -11.5Z');",
				'filled': 'fill-opacity:1;',
				'dark-filled': 'fill-opacity:1;',
			},
			transition: 'transition:d 0.4s linear, fill-opacity 0.4s linear;',
		},
		'l-actj': {
			stateRules: {
				light: "d:path('M0 0h24v24h-48Z');",
				dark: "d:path('M48 0h24v24h-48Z');",
			},
			transition: 'transition:d 0.4s linear;',
		},
		'omafcw': {
			stateRules: {
				'focus':
					"d:path('M14.5 11.5c1.66 0 3 1.34 3 3c0 1.66 -1.34 3 -3 3c-1.66 0 -3 -1.34 -3 -3c0 -1.66 1.34 -3 3 -3Z');",
				'light':
					"d:path('M12 7c2.76 0 5 2.24 5 5c0 2.76 -2.24 5 -5 5c-2.76 0 -5 -2.24 -5 -5c0 -2.76 2.24 -5 5 -5Z');",
				'light_focus':
					"d:path('M12 8c2.21 0 4 1.79 4 4c0 2.21 -1.79 4 -4 4c-2.21 0 -4 -1.79 -4 -4c0 -2.21 1.79 -4 4 -4Z');",
				'filled': 'fill-opacity:1;',
				'light-filled': 'fill-opacity:1;',
			},
			transition: 'transition:d 0.4s linear, fill-opacity 0.4s linear;',
		},
		'c807hd': {
			stateRules: {
				light: "d:path('M0 0h-48v24h24Z');",
				dark: "d:path('M48 0h-48v24h24Z');",
			},
			transition: 'transition:d 0.4s linear;',
		},
		'sh2p6x': {
			stateRules: {
				focus: "d:path('M9.13 2c-2.53 2.06 -3.38 5.7 -1.73 8.63c1.73 3 5.4 3.92 8.48 2.63');",
				dark: "d:path('M12.5 3c-3 2.26 -3.9 6.4 -2 9.75c2 3.45 6.2 4.65 9.66 3.05');",
				dark_focus:
					"d:path('M11.5 2c-3.37 2.75 -4.5 7.6 -2.3 11.5c2.3 4 7.2 5.23 11.3 3.5');",
			},
			transition: 'transition:d 0.4s linear;',
		},
		'rg1nfv': {
			stateRules: {
				focus: "d:path('M9.13 2h0c-3.9 0.26 -7.13 3.53 -7.13 7.5c0 4.14 3.36 7.5 7.5 7.5c2.7 0 5.05 -1.63 6.38 -3.75');",
				dark: "d:path('M12.5 3h-0.5c-4.97 0 -9 4.03 -9 9c0 4.97 4.03 9 9 9c3.6 0 6.73 -2.13 8.16 -5.2');",
				dark_focus:
					"d:path('M11.5 2h0c-5.2 0.35 -9.5 4.7 -9.5 10c0 5.52 4.48 10 10 10c3.6 0 6.73 -2.18 8.5 -5');",
			},
			transition: 'transition:d 0.4s linear;',
		},
		'ia15ro': {
			stateRules: {
				light: "d:path('M-2 -2l10 -10M-2 -2l-10 10');",
				dark: "d:path('M26 26l10 -10M26 26l-10 10');",
			},
			transition: 'transition:d 0.4s linear;',
		},
		'df7-9f': {
			stateRules: {
				focus: "d:path('M14.5 11.5c1.66 0 3 1.34 3 3c0 1.66 -1.34 3 -3 3c-1.66 0 -3 -1.34 -3 -3c0 -1.66 1.34 -3 3 -3Z');",
				light: "d:path('M12 7c2.76 0 5 2.24 5 5c0 2.76 -2.24 5 -5 5c-2.76 0 -5 -2.24 -5 -5c0 -2.76 2.24 -5 5 -5Z');",
				light_focus:
					"d:path('M12 8c2.21 0 4 1.79 4 4c0 2.21 -1.79 4 -4 4c-2.21 0 -4 -1.79 -4 -4c0 -2.21 1.79 -4 4 -4Z');",
			},
			transition: 'transition:d 0.4s linear;',
		},
		'td9rkk': {
			stateRules: {
				focus: "d:path('M14.5 8.88v-2.25M14.5 20.13v2.25M8.88 14.5h-2.25M20.13 14.5h2.25');",
				light: "d:path('M12 3v-1M12 21v1M3 12h-1M21 12h1');",
				light_focus:
					"d:path('M12 4.5v-3M12 19.5v3M4.5 12h-3M19.5 12h3');",
			},
			transition: 'transition:d 0.4s linear;',
		},
		't50njl': {
			stateRules: {
				focus: "d:path('M10.75 10.75l-1.5 -1.5M10.75 18.25l-1.5 1.5M18.25 10.75l1.5 -1.5M18.25 18.25l1.5 1.5');",
				light: "d:path('M5.5 5.5l-0.5 -0.5M5.5 18.5l-0.5 0.5M18.5 5.5l0.5 -0.5M18.5 18.5l0.5 0.5');",
				light_focus:
					"d:path('M7 7l-2 -2M7 17l-2 2M17 7l2 -2M17 17l2 2');",
			},
			transition: 'transition:d 0.4s linear;',
		},
	},
	animations: {
		'mc7__g': 'opacity:0;animation:0.4s linear 0.4s forwards fade-to-1;',
		'sh2p6x':
			'stroke-dasharray:28;animation:0.4s linear forwards so-from-28;',
		'rg1nfv':
			'stroke-dasharray:44;animation:0.4s linear forwards so-from-44;',
		'ia15ro':
			'stroke-dasharray:18;animation:0.4s linear forwards so-from-18;',
		'df7-9f':
			'stroke-dasharray:34;animation:0.4s linear forwards so-from-34;',
		'td9rkk':
			'stroke-dasharray:6;stroke-dashoffset:6;animation:0.4s linear 0.8s forwards so-to-0;',
		't50njl':
			'stroke-dasharray:6;stroke-dashoffset:6;animation:0.4s linear 1s forwards so-to-0;',
	},
};

describe.skip('Testing stateful component', () => {
	const context = createUniqueHashContext();
	const options = componentFactoryFileSystemOptions({
		doubleDirsForCSS: false,
		doubleDirsForComponents: false,
	});
	const extension = `.vue`;
	const ts = false;
	const iconSuffix = ts ? '-ts' : '';

	function createExport(data: FactoryIconData) {
		/*
		return createJSXComponent(data, {
			context,
			...options,
			jsx: 'react',
			fallbackPackage: data.name.startsWith('icon2')
				? undefined
				: '@iconify/css-react',
			cssMode: data.name.startsWith('icon2') ? 'embed' : 'import',
		});
		*/
		return createVueComponent(data, {
			context,
			...options,
			cssMode: data.name.startsWith('icon2') ? 'embed' : 'import',
			ts,
		});
	}

	it('Icon with external CSS', async () => {
		// Convert SVGCSSStatefulIcon
		const convertedIcon1 = prepareComponentFactoryStatefulIcon(icon1)!;
		const convertedIcon2 = prepareComponentFactoryStatefulIcon(icon2)!;
		const convertedIcon3 = prepareComponentFactoryStatefulIcon(icon3)!;
		expect(convertedIcon1 && convertedIcon2 && convertedIcon3).toBeTruthy();
		const data1: FactoryIconData = {
			prefix: 'test',
			name: 'icon1' + iconSuffix,
			icon: convertedIcon1,
		};
		const data2: FactoryIconData = {
			prefix: 'test',
			name: 'icon2' + iconSuffix,
			icon: convertedIcon2,
		};
		const data3: FactoryIconData = {
			prefix: 'test',
			name: 'icon3' + iconSuffix,
			icon: convertedIcon3,
		};

		// Generate component
		const result1 = createExport(data1);
		const result2 = createExport(data2);
		const result3 = createExport(data3);

		// Debug output
		/*
		console.log(result1.content);
		for (const asset of result1.assets) {
			console.log('---');
			console.log(asset.filename);
			console.log(asset.content);
			console.log('---');
		}
        */

		// Write output to file system, actual test is done in framework specific demo
		const file1 = convertGeneratedComponentToFile(data1, result1, {
			...options,
			extension,
		});
		const file2 = convertGeneratedComponentToFile(data2, result2, {
			...options,
			extension,
		});
		const file3 = convertGeneratedComponentToFile(data3, result3, {
			...options,
			extension,
		});
		const allFiles = mergeExportedComponentFiles([file1, file2, file3]);
		await saveExportedFilesToFS(allFiles, './temp/stateful-test');
	});
});
