import { Handler } from '../../../types'

export default {
  get: async (req, res) => {
    await res.text('Hello World')
  }
} as Handler
