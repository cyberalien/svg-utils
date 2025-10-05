export interface UniqueHashOptions {
	// Prefix for the hash
	prefix?: string;

	// If true, use CSS characters, otherwise use ID characters
	css: boolean;

	// Length of the hash
	length: number | ((content: string) => number);

	// Custom lengths for specific hashes
	lengths?: Record<string, number>;

	// If true, throw an error on collision
	throwOnCollision?: boolean;
}
