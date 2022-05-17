import { Handler } from '../../../types'

export default {
  post: async req => {
    return {
      body: req.body,
      query: req.query,
      cookies: req.cookies,
      stupidheader: req.headers.stupidheader
    }
  }
} as Handler
