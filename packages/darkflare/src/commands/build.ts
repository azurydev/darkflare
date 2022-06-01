import getFiles from '@goodies/get-files'
import { join } from 'path'
import getConfiguration from '../modules/getConfiguration'
import { ensureDir, remove } from 'fs-extra'
import createRoute from '../modules/createRoute'
import { copyFile, writeFile, stat, readFile } from 'fs/promises'
import chalk from 'chalk'
import { build } from 'esbuild'
import getMiddleware from '../modules/getMiddleware'
import getReadableSize from '@goodies/get-readable-size'

export default async (directory: string, { dev, testing }: {
  dev: boolean,
  testing: boolean
}) => {
  try {
    console.clear()
    console.log(chalk.yellow('wait') + chalk.blackBright(' - searching for configuration...'))

    const time = Date.now()
    , config = await getConfiguration(directory)
    , middlewares = []
    
    let importsString = ''
    , routesString = ''

    console.clear()
    console.log(chalk.yellow('wait') + chalk.blackBright(' - clearing cache directory...'))
  
    await remove(join(directory, './.darkflare'))
    await ensureDir(join(directory, './.darkflare'))
  
    // add router and handler
    importsString += 'import handler, { IttyRequest } from "./handler"\n'
    importsString += 'import _router from "./router"\n'

    console.clear()
    console.log(chalk.yellow('wait') + chalk.blackBright(' - generating middlewares...'))
  
    // loop through files
    let usesOldMiddlewares = false

    for await (let f of getFiles(join(directory, './src/routes'))) {
      if (f.endsWith('_middleware.ts')) {
        middlewares.push(await getMiddleware(f))
        usesOldMiddlewares = true
      }
    }

    let count = 0
  
    // loop through routes
    for await (let f of getFiles(join(directory, './src/routes'))) {
      if (!f.endsWith('.ts')) continue
      if (f.endsWith('.d.ts')) continue

      console.clear()
      console.log(chalk.yellow('wait') + chalk.blackBright(` - generating routes... (${count})`))
      count++

      const r = await createRoute(f, middlewares, config, config.modules)
      if (!r) continue
  
      importsString += r.imports
      routesString += r.routes
    }

    console.clear()
    console.log(chalk.yellow('wait') + chalk.blackBright(' - generating production-ready app...'))
  
    // loop through middlewares
    for (let m of middlewares)
      importsString += `import ${m.name} from "../src/${m.importPath}"\n`
  
    // copy code
    let codeFolder = testing ? join(__dirname, '../../code') : join(__dirname, '../code')
  
    await copyFile(join(codeFolder, './router.ts'), join(directory, './.darkflare/router.ts'))
    await copyFile(join(codeFolder, './handler.ts'), join(directory, './.darkflare/handler.ts'))
    await copyFile(join(codeFolder, './getCookieString.ts'), join(directory, './.darkflare/getCookieString.ts'))
  
    // add variables
    const handlerContent = await readFile(join(directory, './.darkflare/handler.ts'), { encoding: 'utf-8' })
    await writeFile(join(directory, './.darkflare/handler.ts'), `const ORIGIN = ${JSON.stringify(config.origin)}\nconst LOGGING = ${dev}\n${handlerContent}`)
  
    // create main file
    const fetchHandler = config.modules ? `export default {
      fetch: router.handle
    }` : `addEventListener('fetch', event =>
      event.respondWith(router.handle(event.request))
    )`
  
    const finalString = `${importsString}\nconst ORIGIN = ${JSON.stringify(config.origin)}\n${await readFile(join(codeFolder, './cors.ts'), { encoding: 'utf-8' })}\nconst router = ${config.base ? `_router({ base: ${JSON.stringify(config.base)} })` : '_router()'}\nrouter${routesString}\nrouter.all('*', async (request: IttyRequest) => await handler(request, async () => {
      return { code: 404, message: 'Not Found' }
    }))\n${fetchHandler}`
    await writeFile(join(directory, './.darkflare/index.ts'), finalString)

    console.clear()
    console.log(chalk.yellow('wait') + chalk.blackBright(' - compiling your app...'))
  
    // build file
    await build({
      entryPoints: [join(directory, './.darkflare/index.ts')],
      bundle: true,
      minify: (!config.minify || dev) ? false : true,
      legalComments: 'none',
      format: (!config.modules) ? 'cjs' : 'esm',
      outfile: join(directory, './dist/worker.js')
    })
  
    // log success message
    const { size } = await stat(join(directory, './dist/worker.js'))

    console.clear()
    if (usesOldMiddlewares) console.log(chalk.redBright('warning') + chalk.blackBright(' - _middleware.ts files have been deprecated, please consider migrating to our new middlewares!'))
    if (!config.modules) console.log(chalk.redBright('warning') + chalk.blackBright(' - building for a service worker has been deprecated, please consider using Cloudflare Module Worker format!'))
    console.log(chalk.greenBright('ready') + chalk.blackBright(' - successfully generated a production-ready worker script.'))
    console.log(chalk.blueBright('info') + chalk.blackBright(` - generated your app within ${chalk.bold(`${Date.now() - time} ms`)}.`))
    console.log(chalk.blueBright('info') + chalk.blackBright(` - your worker script has a size of ${chalk.bold(await getReadableSize(size))}.`))
  } catch (err) {
    console.log(chalk.redBright('error') + ' - ' + (err instanceof Error ? err.message : 'Something went wrong.'))
  }
}
