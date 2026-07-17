import type { IconFallbackTemplate } from './types.js';

/**
 * Generate fallback string from template and states
 */
export function getIconFallback(
	template: IconFallbackTemplate,
	values: Record<string, boolean | string>,
	defaultValues?: Record<string, boolean | string>,
	prefix = ''
): string {
	// Add prefix to value if needed
	const addPrefix = (value: string | boolean): string | boolean =>
		value && typeof value === 'string' && prefix && !value.startsWith(prefix)
			? prefix + value
			: value;

	// Get state value
	const stateValue = (state: string): string | boolean =>
		values[state] ?? defaultValues?.[state];

	return template
		.map((chunk) =>
			typeof chunk === 'string'
				? chunk
				: addPrefix(
						'values' in chunk
							? chunk.values[+!!stateValue(chunk.state)]
							: stateValue(chunk.state)
					)
		)
		.join('');
}
