import type { Handler } from 'darkflare'

export const Get: Handler = async () => {
  return {
    code: 400,
    message: 'something went wrong 😮'
  }
}
