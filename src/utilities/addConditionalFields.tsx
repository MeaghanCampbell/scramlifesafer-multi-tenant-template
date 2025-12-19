/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * addConditionFields
 *
 * CURRENT BEHAVIOR
 * ----------------
 * Normalizes a field/block configuration so it can be safely used in:
 *   - formBuilderPlugin({ fields: { ... } })
 *   - blocks: Object.values(availableFieldBlocks)
 *
 * Some form-builder fields may be plain objects or builder functions.
 * This wrapper converts either form into a concrete config object and
 * returns it unchanged.
 *
 * FUTURE USE (conditional logic)
 * ------------------------------
 * When conditional logic is needed, extend this function to append
 * additional admin-only fields (e.g. `conditionalLogic`, `conditions`, etc.)
 * to `baseConfig.fields`.
 *
 * The call signature (`addConditionFields(fieldConfig)`) will remain the same;
 * only the returned field schema will grow when conditional logic is introduced.
 */
export const addConditionFields = (fieldConfig: any) => {
    // Normalize builder functions into config objects
    const baseConfig =
      typeof fieldConfig === 'function'
        ? fieldConfig({})
        : fieldConfig
  
    // For now, return the config unchanged
    return {
      ...baseConfig,
    }
  
    /**
     * FUTURE STRUCTURE (example):
     *
     * return {
     *   ...baseConfig,
     *   fields: [
     *     ...(baseConfig.fields || []),
     *     { name: 'conditionalLogic', type: 'checkbox', label: 'Enable Conditional Logic' },
     *     {
     *       name: 'conditions',
     *       type: 'array',
     *       fields: [
     *         { name: 'field', type: 'text' },
     *         { name: 'operator', type: 'select', options: [...] },
     *         { name: 'value', type: 'text' },
     *       ],
     *     },
     *   ],
     * }
     */
  }
  