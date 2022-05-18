import { Handler } from '../../../types'

export const Post: Handler = async req => {
  return {
    body: req.body,
    query: req.query,
    cookies: req.cookies,
    stupidheader: req.headers.stupidheader
  }
}
