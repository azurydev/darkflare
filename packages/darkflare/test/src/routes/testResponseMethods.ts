import { Handler } from '../../../types'

export default {
  get: async (req, res) => {
    await res.code(400)
    await res.header('accept', 'application/json')
    await res.cookie('a cookie', 'super duper secret', {
      httpOnly: true
    })
  }
} as Handler
