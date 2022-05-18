import type { Handler } from 'darkflare'

export const Get: Handler = async req => {
  return req.customMessage // from middleware
}
