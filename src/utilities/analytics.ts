/* eslint-disable @typescript-eslint/no-explicit-any */

export const pushToDataLayer = (obj: Record<string, any>) => {
    if (typeof window === 'undefined') return;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(obj);
};

export const emitCustomerSubmission = (opts: {
    formId: string | number;
    formName?: string;
    fields: Record<string, any>;
    page?: string;
}) => {
    const { formId, formName, fields, page } = opts;

    const ALLOWED = [
        'email',
        'firstname',
        'lastname',
        'name',
        'company',
        'state',
        'vehicle',
        'message',
        'phone',
        'experience',
        'times',
        'age',
        'plan',
        'referralcode',
        'intent',
        'contactpreference',
        'preference',
        'zipcode',
        'utm_source',
        'utm_medium',
        'utm_campaign',
        'utm_content',
    ];
    const filtered: Record<string, any> = {};
    for (const k of ALLOWED) {
        if (typeof fields[k] !== 'undefined') filtered[k] = fields[k];
    }

    const eventId = `${formId}-${Date.now()}`;

    pushToDataLayer({
        event: 'customerSubmission',
        event_id: eventId,
        form_id: String(formId),
        form_name: formName ?? '',
        page_location: page ?? (typeof window !== 'undefined' ? window.location.href : ''),
        user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
        ...Object.fromEntries(Object.entries(filtered).map(([k, v]) => [`${k}`, v])),
    });
};
  