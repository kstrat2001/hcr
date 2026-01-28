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

const LeadsController = () => import('#controllers/leads_controller')

router.post('/leads', [LeadsController, 'store'])
