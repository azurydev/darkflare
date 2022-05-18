import { Handler } from '../../../../../types'

export const Get: Handler = async req => {
  return req.custom
}
