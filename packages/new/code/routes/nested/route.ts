import type { Handler } from 'darkflare'

export default {
  get: async () => {
    return 'i\'m just a first level nested route 💪'
  }
} as Handler
