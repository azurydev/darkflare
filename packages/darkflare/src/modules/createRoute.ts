import { build } from 'esbuild'
import { join } from 'path'
import getClosestMiddleware from './getClosestMiddleware'

export default async (absolutePath: string, directory: string, middlewares: MiddlewareObject[], config: Configuration, modules: boolean) => {
  let importsString = ''
  , routesString = ''

  const endpoint = absolutePath
    .replaceAll('[', ':')
    .replaceAll(']', '')
    .replace('.ts', '')
    .replaceAll('\\', '/')
    .replaceAll('//', '/')
    .replaceAll('/index', '/')
    .substring(absolutePath.indexOf('routes') + 6)
    .replace('routes', '')
  
  , name = '_' + absolutePath
    .substring(absolutePath.indexOf('routes') + 6)
    .replace('\\', '')
    .replaceAll('\\', '__')
    .replaceAll('[', '_')
    .replaceAll(']', '_')
    .replace('.ts', '')
    .replace(/[^a-zA-Z_]/g, '$')

  , importPath = absolutePath
    .substring(absolutePath.indexOf('routes'))
    .replaceAll('\\', '/')
    .replaceAll('\/', '/')
    .replace('.ts', '')
    .replace('/index', '')

  // compile route to commonjs
  , pathToCommonJsModule = absolutePath.replace(join(directory, './src'), join(directory, './.darkflare/.cache')).replace('.ts', '.cjs')

  await build({
    entryPoints: [absolutePath],
    format: 'cjs',
    bundle: true,
    minify: true,
    outfile: pathToCommonJsModule
  })

  const m = require(pathToCommonJsModule)

  // ignore route if it doesn't export a handler
  if (typeof m !== 'object' || typeof m.default !== 'object') return

  // added route to imports string
  importsString += `import ${name} from "../src/${importPath.replace('/index', '')}"\n`

  let methods = ''

  // determine if route needs a middleware
  const closestMiddleware = middlewares.length > 0 ? await getClosestMiddleware(importPath, middlewares) : undefined

  // add endpoints to routes string
  if (modules) {
    if (typeof m.default.get === 'function') {
      methods += 'GET, '
      routesString += `.get('${endpoint}', async (request: IttyRequest, env: any, context: any) => await handler(request, ${name}.get, env, context${closestMiddleware ? `, ${closestMiddleware.name}` : ''}))`
    }
  
    if (typeof m.default.post === 'function') {
      methods += 'POST, '
      routesString += `.post('${endpoint}', async (request: IttyRequest, env: any, context: any) => await handler(request, ${name}.post, env, context${closestMiddleware ? `, ${closestMiddleware.name}` : ''}))`
    }
  
    if (typeof m.default.patch === 'function') {
      methods += 'PATCH, '
      routesString += `.patch('${endpoint}', async (request: IttyRequest, env: any, context: any) => await handler(request, ${name}.patch, env, context${closestMiddleware ? `, ${closestMiddleware.name}` : ''}))`
    }
  
    if (typeof m.default.put === 'function') {
      methods += 'PUT, '
      routesString += `.put('${endpoint}', async (request: IttyRequest, env: any, context: any) => await handler(request, ${name}.put, env, context${closestMiddleware ? `, ${closestMiddleware.name}` : ''}))`
    }
  
    if (typeof m.default.delete === 'function') {
      methods += 'DELETE, '
      routesString += `.delete('${endpoint}', async (request: IttyRequest, env: any, context: any) => await handler(request, ${name}.delete, env, context${closestMiddleware ? `, ${closestMiddleware.name}` : ''}))`
    }
  
    if (typeof m.default.head === 'function') {
      methods += 'HEAD, '
      routesString += `.head('${endpoint}', async (request: IttyRequest, env: any, context: any) => await handler(request, ${name}.head, env, context${closestMiddleware ? `, ${closestMiddleware.name}` : ''}))`
    }
  } else {
    if (typeof m.default.get === 'function') {
      methods += 'GET, '
      routesString += `.get('${endpoint}', async (request: IttyRequest) => await handler(request, ${name}.get, null, null${closestMiddleware ? `, ${closestMiddleware.name}` : ''}))`
    }
  
    if (typeof m.default.post === 'function') {
      methods += 'POST, '
      routesString += `.post('${endpoint}', async (request: IttyRequest) => await handler(request, ${name}.post, null, null${closestMiddleware ? `, ${closestMiddleware.name}` : ''}))`
    }
  
    if (typeof m.default.patch === 'function') {
      methods += 'PATCH, '
      routesString += `.patch('${endpoint}', async (request: IttyRequest) => await handler(request, ${name}.patch, null, null${closestMiddleware ? `, ${closestMiddleware.name}` : ''}))`
    }
  
    if (typeof m.default.put === 'function') {
      methods += 'PUT, '
      routesString += `.put('${endpoint}', async (request: IttyRequest) => await handler(request, ${name}.put, null, null${closestMiddleware ? `, ${closestMiddleware.name}` : ''}))`
    }
  
    if (typeof m.default.delete === 'function') {
      methods += 'DELETE, '
      routesString += `.delete('${endpoint}', async (request: IttyRequest) => await handler(request, ${name}.delete, null, null${closestMiddleware ? `, ${closestMiddleware.name}` : ''}))`
    }
  
    if (typeof m.default.head === 'function') {
      methods += 'HEAD, '
      routesString += `.head('${endpoint}', async (request: IttyRequest) => await handler(request, ${name}.head, null, null${closestMiddleware ? `, ${closestMiddleware.name}` : ''}))`
    }
  }

  // add endpoint for preflight request
  if (config.handlePreflightRequests) routesString += `.options('${endpoint}', cors('${methods.substring(0, methods.length - 2)}'))`

  return {
    routes: routesString,
    imports: importsString
  }
}
