/**
 * Custom Alignment Field
 *
 * A shared field that updates alignment of items on the page
 */

import type { Field } from 'payload';

const alignment: Field = {
    name: 'alignment',
    label: 'Aligment',
    admin: {
        description: 'Set position of elements within the block.'
    },
    type: 'select',
    interfaceName: 'alignmentField',
    options: [
        {
            value: 'left', 
            label: 'Left'
        },
        {
            value: 'center', 
            label: 'Center'
        },
        {
            value: 'right', 
            label: 'Right'
        }
    ],
    defaultValue: 'left'
}
export default alignment