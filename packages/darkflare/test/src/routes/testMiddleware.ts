import { Handler } from '../../../types'

export default {
  get: async req => {
    return req.custom
  }
} as Handler
