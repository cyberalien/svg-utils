import type { IconFallbackTemplate } from './types.js';

/**
 * Generate fallback string from template and states
 */
export function getIconFallback(
	template: IconFallbackTemplate,
	values: Record<string, boolean | string>,
	defaultValues?: Record<string, boolean | string>
): string {
	const stateValue = (state: string): string | boolean =>
		values[state] ?? defaultValues?.[state];
	return template
		.map((chunk) =>
			typeof chunk === 'string'
				? chunk
				: 'values' in chunk
					? chunk.values[+!!stateValue(chunk.state)]
					: stateValue(chunk.state)
		)
		.join('');
}
