import type { IconFallbackTemplate } from './types.js';

/**
 * Generate fallback string from template and states
 */
export function getIconFallback(
	template: IconFallbackTemplate,
	values: Record<string, boolean | string>
): string {
	return template
		.map((chunk) =>
			typeof chunk === 'string'
				? chunk
				: 'values' in chunk
					? chunk.values[+!!values[chunk.state]]
					: values[chunk.state]
		)
		.join('');
}
