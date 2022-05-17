import type { Handler } from 'darkflare'

export default {
  get: async req => {
    return {
      city: req.city,
      country: req.country,
      ip: req.ip
    }
  }
} as Handler
