import type { Middleware } from 'darkflare'

const middleware: Middleware = async req => {
  req.customMessage = 'hello world! 👋'
}

export default middleware
