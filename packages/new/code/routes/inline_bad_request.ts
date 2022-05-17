import type { Handler } from 'darkflare'

export default {
  get: async () => {
    return {
      code: 400,
      message: 'something went wrong 😮'
    }
  }
} as Handler
