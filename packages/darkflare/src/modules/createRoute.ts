import { build } from 'esbuild'
import getClosestMiddleware from './getClosestMiddleware'

export default async (absolutePath: string, middlewares: MiddlewareObject[], config: Configuration, modules: boolean) => {
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

  , compilePath = absolutePath
    .substring(absolutePath.indexOf('routes'))
    .replaceAll('\\', '/')
    .replaceAll('\/', '/')

  // compile route to commonjs
  const result = await build({
    entryPoints: [absolutePath],
    format: 'esm',
    metafile: true,
    write: false
  })

  const outputs = result.metafile?.outputs

  // @ts-ignore
  const exportedModules = outputs[/[^/]*$/.exec(compilePath)[0].replace('.ts', '.js')].exports

  let methods = ''

  // determine if route needs a middleware
  const closestMiddleware = middlewares.length > 0 ? await getClosestMiddleware(importPath, middlewares) : undefined

  // add endpoints to routes string
  if (modules) {
    if (exportedModules.includes('Get')) {
      methods += 'Get, '
      routesString += `.get('${endpoint}', async (request: IttyRequest, env: any, context: any) => await handler(request, ${name}_Get, env, context${closestMiddleware ? `, ${closestMiddleware.name}` : ''}))`
    }
  
    if (exportedModules.includes('Post')) {
      methods += 'Post, '
      routesString += `.post('${endpoint}', async (request: IttyRequest, env: any, context: any) => await handler(request, ${name}_Post, env, context${closestMiddleware ? `, ${closestMiddleware.name}` : ''}))`
    }
  
    if (exportedModules.includes('Patch')) {
      methods += 'Patch, '
      routesString += `.patch('${endpoint}', async (request: IttyRequest, env: any, context: any) => await handler(request, ${name}_Patch, env, context${closestMiddleware ? `, ${closestMiddleware.name}` : ''}))`
    }
  
    if (exportedModules.includes('Put')) {
      methods += 'Put, '
      routesString += `.put('${endpoint}', async (request: IttyRequest, env: any, context: any) => await handler(request, ${name}_Put, env, context${closestMiddleware ? `, ${closestMiddleware.name}` : ''}))`
    }
  
    if (exportedModules.includes('Delete')) {
      methods += 'Delete, '
      routesString += `.delete('${endpoint}', async (request: IttyRequest, env: any, context: any) => await handler(request, ${name}_Delete, env, context${closestMiddleware ? `, ${closestMiddleware.name}` : ''}))`
    }
  
    if (exportedModules.includes('Head')) {
      methods += 'Head, '
      routesString += `.head('${endpoint}', async (request: IttyRequest, env: any, context: any) => await handler(request, ${name}_Head, env, context${closestMiddleware ? `, ${closestMiddleware.name}` : ''}))`
    }
  } else {
    if (exportedModules.includes('Get')) {
      methods += 'Get, '
      routesString += `.get('${endpoint}', async (request: IttyRequest) => await handler(request, ${name}_Get, null, null${closestMiddleware ? `, ${closestMiddleware.name}` : ''}))`
    }
  
    if (exportedModules.includes('Post')) {
      methods += 'Post, '
      routesString += `.post('${endpoint}', async (request: IttyRequest) => await handler(request, ${name}_Post, null, null${closestMiddleware ? `, ${closestMiddleware.name}` : ''}))`
    }
  
    if (exportedModules.includes('Patch')) {
      methods += 'Patch, '
      routesString += `.patch('${endpoint}', async (request: IttyRequest) => await handler(request, ${name}_Patch, null, null${closestMiddleware ? `, ${closestMiddleware.name}` : ''}))`
    }
  
    if (exportedModules.includes('Put')) {
      methods += 'Put, '
      routesString += `.put('${endpoint}', async (request: IttyRequest) => await handler(request, ${name}_Put, null, null${closestMiddleware ? `, ${closestMiddleware.name}` : ''}))`
    }
  
    if (exportedModules.includes('Delete')) {
      methods += 'Delete, '
      routesString += `.delete('${endpoint}', async (request: IttyRequest) => await handler(request, ${name}_Delete, null, null${closestMiddleware ? `, ${closestMiddleware.name}` : ''}))`
    }
  
    if (exportedModules.includes('Head')) {
      methods += 'Head, '
      routesString += `.head('${endpoint}', async (request: IttyRequest) => await handler(request, ${name}_Head, null, null${closestMiddleware ? `, ${closestMiddleware.name}` : ''}))`
    }
  }

  methods = methods
    .substring(0, methods.length - 2)
    .replace('Get', `Get as ${name}_Get`)
    .replace('Post', `Post as ${name}_Post`)
    .replace('Patch', `Patch as ${name}_Patch`)
    .replace('Put', `Put as ${name}_Put`)
    .replace('Delete', `Delete as ${name}_Delete`)
    .replace('Head', `Head as ${name}_Head`)

  // added route to imports string
  importsString += `import { ${methods} } from "../src/${importPath.replace('/index', '')}"\n`

  // add endpoint for preflight request
  if (config.handlePreflightRequests) routesString += `.options('${endpoint}', cors('${methods.toUpperCase()}'))`

  return {
    routes: routesString,
    imports: importsString
  }
}
