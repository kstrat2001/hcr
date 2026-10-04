import { test } from '@japa/runner'
import { DateTime } from 'luxon'
import mail from '@adonisjs/mail/services/main'
import emitter from '@adonisjs/core/services/emitter'
import env from '#start/env'
import Lead from '#models/lead'
import NewLeadNotification from '#mails/new_lead_notification'

test.group('NewLeadNotification', (group) => {
  group.each.teardown(() => mail.restore())

  test('goes out as MAIL_FROM, to NOTIFICATION_EMAIL, replying to the lead', async ({ assert }) => {
    const { mails } = mail.fake()

    // The sender is applied from config/mail.ts when the message is
    // compiled, so it is read off the compiled message, not the mail class.
    let compiled: any
    emitter.once('mail:sending', (event) => {
      compiled = event.message
    })

    const lead = new Lead()
    lead.repoUrl = 'https://example.com/repo'
    lead.email = 'lead@example.com'
    lead.createdAt = DateTime.now()

    await mail.send(new NewLeadNotification(lead, 'DEEP_AUDIT'))

    mails.assertSent(NewLeadNotification, ({ message }) => {
      message.assertTo(env.get('NOTIFICATION_EMAIL'))
      message.assertReplyTo('lead@example.com')
      message.assertSubject('HCR Lead: https://example.com/repo')
      return true
    })

    assert.deepEqual(compiled.from, {
      address: env.get('MAIL_FROM'),
      name: 'Human Code Reader',
    })
  })
})
