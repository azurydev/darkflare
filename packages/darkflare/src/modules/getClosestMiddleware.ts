import { closestMatch } from 'closest-match'

const getClosestMiddleware = async (importPath: string, middlewares: MiddlewareObject[]) => {
  const middlewareNames = []

  for (let m of middlewares) {
    middlewareNames.push(m.importPath)
  }
  
  const closest = closestMatch(importPath, middlewareNames)

  return middlewares.filter(m => {
    return m.importPath === closest
  })[0]
}

export default getClosestMiddleware
