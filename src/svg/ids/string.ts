/**
 * Change ID in a string
 */
export function changeIDInString(
	value: string,
	oldID: string,
	newID: string
): string {
	const escapedID = oldID.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

	return value.replace(
		// Allowed characters before id: [#;"]
		// Allowed characters after id: [)"], .[a-z]
		new RegExp('([#;"])(' + escapedID + ')([")]|\\.[a-z])', 'g'),
		'$1' + newID + '$3'
	);
}
