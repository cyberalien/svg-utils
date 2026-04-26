const regex = /\sid="/g;

/**
 * Check if content has IDs to replace
 */
export function checkForUniqueIDs(content: string): boolean {
	return !!regex.exec(content);
}
