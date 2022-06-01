import { Handler } from '../../../types'

export const beforeAll: Handler = async req => {
  req.custom = 'something more awesome'
}

export const Get: Handler = async req => {
  return req.custom
}
