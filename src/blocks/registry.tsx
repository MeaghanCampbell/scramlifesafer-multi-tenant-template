/* eslint-disable @typescript-eslint/no-explicit-any */
import dynamic from 'next/dynamic'

const load = <K extends string>(
  imp: () => Promise<any>,
  key: K,
) => dynamic(async () => (await imp())[key], { loading: () => null })

export const blockComponents = {
    mediaBlock:            load(() => import('./MediaBlock/Component'), 'MediaBlock'),
    cta:                   load(() => import('./CallToAction/Component'), 'CallToActionBlock'),
    formBlock:             load(() => import('./Form/Component'), 'FormBlock'),
    modal:                 load(() => import('./Modal/Component'), 'ModalBlock'),
    text:                  load(() => import('./Text/Component'), 'TextBlock'),
    spacer:                load(() => import('./Spacer/Component'), 'SpacerBlock'),
}