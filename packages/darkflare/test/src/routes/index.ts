import { Handler } from '../../../types'

export default {
  get: async () => {
    return 'Hello World'
  },
  post: async () => {
    return 'Hello World'
  },
  put: async () => {
    return 'Hello World'
  },
  patch: async () => {
    return 'Hello World'
  },
  delete: async () => {
    return 'Hello World'
  },
  head: async () => {
    return 'Hello World'
  }
} as Handler
