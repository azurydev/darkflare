import { Handler } from '../../../../types'

export default {
  get: async req => {
    return req.params
  }
} as Handler
