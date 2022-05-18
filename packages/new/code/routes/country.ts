import type { Handler } from 'darkflare'

export const Get: Handler = async req => {
  return `you're from ${req.country} 👀`
}
