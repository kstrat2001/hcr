/**
 * Every call to action on Human Code Reader leads to Darkly Energized:
 * HCR reviews are run by Darkly Energized LLC, and HCR collects nothing
 * itself. A visitor without a DE account is sent to sign up first, then
 * returned to "Start a project".
 *
 * The UTM tags are what DE's page-view tracking records, so each link
 * names where on HCR it was clicked.
 */
export const DE_ORIGIN = 'https://darklyenergized.com'

export type DeCampaign = 'pricing' | 'home_cta' | 'nav' | 'footer'

export function startProjectUrl(campaign: DeCampaign, content?: string): string {
  const params = new URLSearchParams({
    utm_source: 'hcr',
    utm_medium: 'referral',
    utm_campaign: campaign,
  })
  if (content) params.set('utm_content', content)
  return `${DE_ORIGIN}/projects/new?${params.toString()}`
}

export const DE_LEGAL = {
  terms: `${DE_ORIGIN}/terms`,
  privacy: `${DE_ORIGIN}/privacy`,
  disclaimer: `${DE_ORIGIN}/disclaimer`,
}

export const DE_LOGO = `${DE_ORIGIN}/images/logo_moon.webp`
