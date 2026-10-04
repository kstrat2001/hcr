/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
router.on('/').renderInertia('home')
router.on('/pricing').renderInertia('pricing')

/**
 * The lead form used to live here. Human Code Reader no longer collects
 * anything: every call to action goes to Darkly Energized's sign-up and
 * "Start a project". Old links to /terminal (they carried ?plan=<MODEL>)
 * are sent on permanently, keeping the model as utm_content.
 */
router.get('/terminal', ({ request, response }) => {
  const params = new URLSearchParams({
    utm_source: 'hcr',
    utm_medium: 'referral',
    utm_campaign: 'pricing',
  })
  const plan = request.input('plan')
  if (typeof plan === 'string' && /^[A-Za-z_]{1,40}$/.test(plan)) {
    params.set('utm_content', plan.toLowerCase())
  }
  return response
    .redirect()
    .status(301)
    .toPath(`https://darklyenergized.com/projects/new?${params.toString()}`)
})
