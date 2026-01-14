import { BeforeEmail } from '@payloadcms/plugin-form-builder/types'
import { FormSubmission } from '@/payload-types'

export const beforeEmailFormSubmit: BeforeEmail<FormSubmission> = async (emails, { data }) => {

  const parseList = (v: unknown): string[] =>
    String(v || '')
      .split(/[,\n;]+/)
      .map(s => s.trim())
      .filter(Boolean)

  const submissionData: { field: string; value: unknown }[] = []
  if (data && typeof data === 'object') {
    Object.entries(data).forEach(([key, value]) => {
      if (['form', 'customData', 'submissionData', 'hubspotCookie', 'pageUri', 'pageName', 'updatedAt', 'createdAt'].includes(key)) return
      if (value === undefined || value === null) return
      submissionData.push({ field: key, value })
    })
  }

  return emails
    .map((email) => {

      const toList  = Array.isArray(email.to)  ? email.to  : parseList(email.to)
      const ccList  = Array.isArray(email.cc)  ? email.cc  : parseList(email.cc)
      const bccList = Array.isArray(email.bcc) ? email.bcc : parseList(email.bcc)

      let htmlContent = typeof email.html === 'string' ? email.html : ''

      submissionData.forEach(({ field, value }) => {
        const placeholder = new RegExp(`\\{\\{${field}\\}\\}`, 'g')
        htmlContent = htmlContent.replace(placeholder, String(value ?? ''))
      })

      if (htmlContent.includes('{{*}}')) {
        const allDataString = submissionData.map(({ field, value }) => `${field}: ${value ?? ''}`).join('\n')
        htmlContent = htmlContent.replace(/\{\{\*\}\}/g, allDataString)
      }

      if (htmlContent.includes('{{*:table}}')) {
        const tableHTML = `
          <table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse;">
            ${submissionData.map(({ field, value }) => `
              <tr>
                <td style="padding: 8px; border: 1px solid #ddd;"><strong>${field}</strong></td>
                <td style="padding: 8px; border: 1px solid #ddd;">${value ?? ''}</td>
              </tr>
            `).join('')}
          </table>
        `
        htmlContent = htmlContent.replace(/\{\{\*:table\}\}/g, tableHTML)
      }

      return {
        ...email,
        to: toList,
        cc: ccList,
        bcc: bccList,
        html: htmlContent,
      }
    })
    .filter(Boolean) as typeof emails
}
