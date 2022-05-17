import type { Handler } from 'darkflare'

export default {
  get: async req => {
    return `you're from ${req.country} 👀`
  }
} as Handler
