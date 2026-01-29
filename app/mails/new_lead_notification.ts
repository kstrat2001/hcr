import { BaseMail } from '@adonisjs/mail'
import Lead from '#models/lead'
import env from '#start/env'

export default class NewLeadNotification extends BaseMail {
  from = 'system@humancodereader.com'
  subject = 'New Lead Detected'

  constructor(private lead: Lead, private model?: string) {
    super()
  }

  /**
   * The "prepare" method is called automatically when
   * the email is sent or queued.
   */
  prepare() {
    this.message
    const subjectId = this.lead.repoUrl === 'NOT_PROVIDED' ? this.lead.email : this.lead.repoUrl
    this.message
      .to(env.get('NOTIFICATION_EMAIL'))
      .subject(`HCR Lead: ${subjectId}`)
      .htmlView('emails/new_lead', { lead: this.lead, model: this.model })
  }
}
