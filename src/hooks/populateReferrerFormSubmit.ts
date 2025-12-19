import { CollectionBeforeChangeHook } from "payload";
import { headers as getHeaders } from 'next/headers'

export const populateRefererFormSubmit: CollectionBeforeChangeHook = async ({ data }) => {
    const headers = await getHeaders();
    const referer = headers.get('referer')

    data.url = referer

    return data;
}