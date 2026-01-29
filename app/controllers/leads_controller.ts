import type { HttpContext } from '@adonisjs/core/http'
import Lead from '#models/lead'
import mail from '@adonisjs/mail/services/main'
import NewLeadNotification from '#mails/new_lead_notification'

export default class LeadsController {
  async store({ request, response }: HttpContext) {
    const data = request.only(['repoUrl', 'email'])
    
    // In a real app, use a validator here!
    
    const lead = await Lead.create(data)

    // Attempt to send email, but don't block response on failure
    try {
      await mail.send(new NewLeadNotification(lead))
    } catch (error) {
      console.error('Failed to send lead email:', error)
    }

    return response.json({ success: true, message: 'Data received. Analysis pending.' })
  }
}