import { Handler } from '../../../types'

export default {
  get: async (req, res) => {
    await res.json({ message: 'Hello World' })
  }
} as Handler
