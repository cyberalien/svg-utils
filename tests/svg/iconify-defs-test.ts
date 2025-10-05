import { splitSVGDefs } from '../../src/svg/content/defs.js';

describe('Parsing Iconify data', () => {
	it('Split defs', () => {
		// No defs
		const simpleBody =
			'<path d="M12,21L15.6,16.2C14.6,15.45 13.35,15 12,15C10.65,15 9.4,15.45 8.4,16.2L12,21" opacity="0"><animate id="spinner_jbAr" begin="0;spinner_8ff3.end+0.2s" attributeName="opacity" calcMode="discrete" dur="0.25s" values="0;1" fill="freeze"/><animate id="spinner_8ff3" begin="spinner_aTlH.end+0.5s" attributeName="opacity" dur="0.001s" values="1;0" fill="freeze"/></path><path d="M12,9C9.3,9 6.81,9.89 4.8,11.4L6.6,13.8C8.1,12.67 9.97,12 12,12C14.03,12 15.9,12.67 17.4,13.8L19.2,11.4C17.19,9.89 14.7,9 12,9Z" opacity="0"><animate id="spinner_dof4" begin="spinner_jbAr.end" attributeName="opacity" calcMode="discrete" dur="0.25s" values="0;1" fill="freeze"/><animate begin="spinner_aTlH.end+0.5s" attributeName="opacity" dur="0.001s" values="1;0" fill="freeze"/></path><path d="M12,3C7.95,3 4.21,4.34 1.2,6.6L3,9C5.5,7.12 8.62,6 12,6C15.38,6 18.5,7.12 21,9L22.8,6.6C19.79,4.34 16.05,3 12,3" opacity="0"><animate id="spinner_aTlH" begin="spinner_dof4.end" attributeName="opacity" calcMode="discrete" dur="0.25s" values="0;1" fill="freeze"/><animate begin="spinner_aTlH.end+0.5s" attributeName="opacity" dur="0.001s" values="1;0" fill="freeze"/></path>';

		expect(splitSVGDefs(simpleBody)).toEqual({
			defs: '',
			content: simpleBody,
		});

		// Defs
		const body1 = '<g id="body1" />';
		const defs1 =
			'<clipPath id="clipPath16" clipPathUnits="userSpaceOnUse"><path id="path18" d="M 0,38 38,38 38,0 0,0 0,38 Z"/></clipPath>';
		const defs2 =
			'<clipPath id="clipPath17" clipPathUnits="userSpaceOnUse"><path id="path18" d="M 0,38 38,38 38,0 0,0 0,38 Z"/></clipPath>';
		const body2 = '<g id="body2" />';

		// Defs in middle with a useless attribute
		expect(
			splitSVGDefs(`${body1}<defs id="defs6">${defs1}</defs>${body2}`)
		).toEqual({
			defs: defs1,
			content: body1 + body2,
		});

		// Multiple defs at start
		expect(
			splitSVGDefs(
				`<defs>${defs1}</defs><defs>${defs2}</defs>${body1}${body2}`
			)
		).toEqual({
			defs: defs1 + defs2,
			content: body1 + body2,
		});

		// Multiple defs, content in middle
		expect(
			splitSVGDefs(
				`${body1}<defs>${defs1}</defs>${body2}<defs>${defs2}</defs>`
			)
		).toEqual({
			defs: defs1 + defs2,
			content: body1 + body2,
		});

		// Self closing defs
		expect(
			splitSVGDefs(
				`<defs />${body1}<defs>${defs1}</defs><defs />${body2}<defs>${defs2}</defs><defs />`
			)
		).toEqual({
			defs: defs1 + defs2,
			content: body1 + body2,
		});
	});
});
