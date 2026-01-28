import type { HttpContext } from '@adonisjs/core/http'
import Lead from '#models/lead'

export default class LeadsController {
  async store({ request, response }: HttpContext) {
    const data = request.only(['repoUrl', 'email'])
    
    // In a real app, use a validator here!
    
    await Lead.create(data)

    return response.json({ success: true, message: 'Data received. Analysis pending.' })
  }
}