import type { Handler } from 'darkflare'

export default {
  get: async (req, res) => {
    res.redirect('https://google.com') // temporary redirect
  }
} as Handler
