import { BaseMail } from '@adonisjs/mail'
import Lead from '#models/lead'
import env from '#start/env'

export default class NewLeadNotification extends BaseMail {
  from = 'system@humancodereader.com'
  subject = 'New Lead Detected'

  constructor(private lead: Lead) {
    super()
  }

  /**
   * The "prepare" method is called automatically when
   * the email is sent or queued.
   */
  prepare() {
    this.message
      .to(env.get('NOTIFICATION_EMAIL'))
      .subject(`HCR Lead: ${this.lead.repoUrl}`)
      .htmlView('emails/new_lead', { lead: this.lead })
  }
}
