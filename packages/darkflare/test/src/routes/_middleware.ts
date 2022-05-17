import { Middleware } from '../../../types'

const middleware: Middleware = async req => {
  req.custom = 'something awesome'
}

export default middleware
