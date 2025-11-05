/**
 * Method of importing CSS in generated components
 *
 * 'import' - Create external CSS file and import it in component
 * 'module' - Create CSS module and import it in component
 * 'prop' - Export CSS as separate property in generated data, do not import in component, do not create asset
 */
export type CSSExportMode = 'import' | 'module' | 'prop';
