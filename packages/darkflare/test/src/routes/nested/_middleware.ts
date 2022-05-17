import { Middleware } from '../../../../types'

const middleware: Middleware = async req => {
  req.custom = 'something cool'
}

export default middleware
