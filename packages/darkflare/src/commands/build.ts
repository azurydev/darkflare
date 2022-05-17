import getFiles from '@goodies/get-files'
import { join } from 'path'
import getConfiguration from '../modules/getConfiguration'
import { ensureDir, remove } from 'fs-extra'
import createRoute from '../modules/createRoute'
import { copyFile, writeFile, stat, readFile } from 'fs/promises'
import chalk from 'chalk'
import boxen from 'boxen'
import { build } from 'esbuild'
import getMiddleware from '../modules/getMiddleware'

export default async (directory: string, { dev, testing }: {
  dev: boolean,
  testing: number
}) => {
  const time = Date.now()
  , config = await getConfiguration(directory)
  , middlewares = []
  
  let importsString = ''
  , routesString = ''

  await remove(join(directory, './.darkflare'))
  await ensureDir(join(directory, './.darkflare'))

  // add router and handler
  importsString += 'import handler, { IttyRequest } from "./handler"\n'
  importsString += 'import _router from "./router"\n'

  // loop through files
  for await (let f of getFiles(join(directory, './src/routes')))
    if (f.endsWith('_middleware.ts'))
      middlewares.push(await getMiddleware(f))

  // loop through routes
  for await (let f of getFiles(join(directory, './src/routes'))) {
    const r = await createRoute(f, directory, middlewares, config, testing === 1 ? false : config.modules)
    if (!r) continue

    importsString += r.imports
    routesString += r.routes
  }

  // loop through middlewares
  for (let m of middlewares)
    importsString += `import ${m.name} from "../src/${m.importPath}"\n`

  // copy code
  let codeFolder = testing > 0 ? join(__dirname, '../../code') : join(__dirname, '../code')

  await copyFile(join(codeFolder, './router.ts'), join(directory, './.darkflare/router.ts'))
  await copyFile(join(codeFolder, './handler.ts'), join(directory, './.darkflare/handler.ts'))
  await copyFile(join(codeFolder, './getCookieString.ts'), join(directory, './.darkflare/getCookieString.ts'))

  // add variables
  const handlerContent = await readFile(join(directory, './.darkflare/handler.ts'), { encoding: 'utf-8' })
  await writeFile(join(directory, './.darkflare/handler.ts'), `const ORIGIN = ${JSON.stringify(config.origin)}\nconst LOGGING = ${dev}\n${handlerContent}`)

  // create main file
  const fetchHandler = testing === 2 ? `addEventListener('fetch', event =>
  event.respondWith(router.handle(event.request))
  )` : config.modules ? `export default {
    fetch: router.handle
  }` : `addEventListener('fetch', event =>
    event.respondWith(router.handle(event.request))
  )`

  const finalString = `${importsString}\nconst ORIGIN = ${JSON.stringify(config.origin)}\n${await readFile(join(codeFolder, './cors.ts'), { encoding: 'utf-8' })}\nconst router = ${config.base ? `_router({ base: ${JSON.stringify(config.base)} })` : '_router()'}\nrouter${routesString}\nrouter.all('*', async (request: IttyRequest) => await handler(request, async () => {
    return { code: 404, message: 'Not Found' }
  }))\n${fetchHandler}`
  await writeFile(join(directory, './.darkflare/index.ts'), finalString)

  // build file
  await build({
    entryPoints: [join(directory, './.darkflare/index.ts')],
    bundle: true,
    minify: (!config.minify || dev) ? false : true,
    legalComments: 'none',
    format: (testing === 2 || !config.modules) ? 'cjs' : 'esm',
    outfile: join(directory, './dist/worker.js')
  })

  // log success message
  const { size } = await stat(join(directory, './dist/worker.js'))

  console.log(boxen(chalk.greenBright(`${Date.now() - time} ms \n${size / 1000} kB`), {
    borderColor: 'yellowBright',
    borderStyle: 'round',
    padding: 1
  }))
}
