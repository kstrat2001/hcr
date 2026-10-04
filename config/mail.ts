import env from '#start/env'
import { defineConfig, transports } from '@adonisjs/mail'

const smtpPort = env.get('SMTP_PORT')

const mailConfig = defineConfig({
  default: 'smtp',

  /**
   * Every message goes out as MAIL_FROM. The SMTP account only accepts
   * senders it may send as (Microsoft 365 answers "554 5.2.252
   * SendAsDenied" otherwise), so the address lives in the environment
   * next to the credentials rather than hardcoded in a mail class.
   */
  from: {
    address: env.get('MAIL_FROM'),
    name: 'Human Code Reader',
  },

  /**
   * The mailers object can be used to configure multiple mailers
   * each using a different transport or same transport with different
   * options.
   */
  mailers: {
    smtp: transports.smtp({
      host: env.get('SMTP_HOST'),
      port: smtpPort,
      secure: smtpPort === 465,
      requireTLS: smtpPort === 587,
      auth: {
        type: 'login',
        user: env.get('SMTP_USERNAME'),
        pass: env.get('SMTP_PASSWORD') || '',
      },
    }),
  },
})

export default mailConfig

declare module '@adonisjs/mail/types' {
  export interface MailersList extends InferMailers<typeof mailConfig> {}
}
