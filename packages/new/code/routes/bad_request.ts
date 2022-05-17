import type { Handler } from 'darkflare'

export default {
  get: async (req, res) => {
    await res.code(400)

    return 'something went wrong 😮'
  }
} as Handler
