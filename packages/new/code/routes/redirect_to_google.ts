import type { Handler } from 'darkflare'

export const Get: Handler = async (req, res) => {
  res.redirect('https://google.com') // temporary redirect
}
