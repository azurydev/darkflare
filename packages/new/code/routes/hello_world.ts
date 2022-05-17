import type { Handler } from 'darkflare'

export default {
  get: async req => {
    return req.customMessage // from middleware
  }
} as Handler
