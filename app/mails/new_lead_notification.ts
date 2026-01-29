import { BaseMail } from '@adonisjs/mail'
import Lead from '#models/lead'

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
      .to('kain@darkbook.local') // Replace with your real email in Production
      .subject(`HCR Lead: ${this.lead.repoUrl}`)
      .htmlView('emails/new_lead', { lead: this.lead })
  }
}