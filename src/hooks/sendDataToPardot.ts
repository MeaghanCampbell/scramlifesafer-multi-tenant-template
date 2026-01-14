/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { CollectionAfterChangeHook } from "payload";

export const sendDataToPardot: CollectionAfterChangeHook = async ({ doc, req, operation }) => {

    // Only run on create (new submissions)
    if (operation !== 'create') return doc

    // Get the form to check if it has a Pardot handler
    const form = typeof doc.form === 'string' 
      ? await req.payload.findByID({ collection: 'forms', id: doc.form })
      : doc.form

    // Check if this form has Pardot integration enabled
    if (!form?.pardotHandlerUrl || !form?.pardotFields?.length) {
      return doc
    }

    try {
      const pardotData = new URLSearchParams()
      
      // Get the list of fields to send
      const fieldsToSend = form.pardotFields.map((f: any) => f.fieldName)
      
      // Only send fields that are in the pardotFields array
      if (doc.customData && Array.isArray(doc.customData)) {
        doc.customData.forEach((field: any) => {
          if (fieldsToSend.includes(field.label) && field.value) {
            pardotData.append(field.label, field.value)
          }
        })
      }

      // Post to Pardot form handler
      const response = await fetch(form.pardotHandlerUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: pardotData.toString(),
      })

      req.payload.logger.info(`Sent form submission to Pardot: ${doc.id}`)
    } catch (error) {
      req.payload.logger.error(`Failed to send to Pardot: ${error}`)
    }

    return doc
}