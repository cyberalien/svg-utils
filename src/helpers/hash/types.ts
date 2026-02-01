/**
 * Context for hashing functions, used to ensure uniqueness
 */
export interface HashContext {
	// Hashes cache, per prefix
	cache?: Record<string, string>;
}

/**
 * Length option for hash
 */
type LengthOption = number | ((content: string) => number);

/**
 * Partial options, used for extending type
 */
export interface UniqueHashPartialOptions {
	// Context, used to make sure all hashes within the same context are unique
	context: HashContext;

	// Prefix for the hash
	prefix?: string;

	// Length of the hash
	length?: LengthOption;

	// Custom lengths for specific hashes
	lengths?: Record<string, number>;

	// If true, throw an error on collision
	throwOnCollision?: boolean;
}

/**
 * Options for unique hash generation
 */
export interface UniqueHashOptions extends UniqueHashPartialOptions {
	// If true, use CSS characters, otherwise use ID characters
	css: boolean;

	// Length of the hash, required
	length: LengthOption;
}
