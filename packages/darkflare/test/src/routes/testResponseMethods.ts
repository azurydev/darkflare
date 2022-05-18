import { Handler } from '../../../types'

export const Get: Handler = async (req, res) => {
  await res.code(400)
  await res.header('accept', 'application/json')
  await res.cookie('a cookie', 'super duper secret', {
    httpOnly: true
  })
}
