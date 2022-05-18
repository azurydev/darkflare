import { Handler } from '../../../types'

export const Get: Handler = async (req, res) => {
  await res.redirect('https://google.com')
}
