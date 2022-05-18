import type { Handler } from 'darkflare'

export const Get: Handler = async req => {
  return {
    city: req.city,
    country: req.country,
    ip: req.ip
  }
}
