import { Middleware } from '../../../../../types'

const middleware: Middleware = async req => {
  req.custom = 'something nice'
}

export default middleware
