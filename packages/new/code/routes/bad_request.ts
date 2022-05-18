import type { Handler } from 'darkflare'

export const Get: Handler = async (req, res) => {
  await res.code(400)

  return 'something went wrong 😮'
}
