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
router.on('/terminal').renderInertia('terminal')

const LeadsController = () => import('#controllers/leads_controller')

router.post('/leads', [LeadsController, 'store'])
