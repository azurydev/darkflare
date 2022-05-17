import { Handler } from '../../../types'

export default {
  get: async (req, res) => {
    await res.redirect('https://google.com')
  }
} as Handler
