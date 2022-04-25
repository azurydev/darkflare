import { build } from 'esbuild'
import getFiles from '../../modules/getFiles'
import { existsSync, statSync } from 'fs'
import { writeFile, mkdir, readFile, copyFile } from 'fs/promises'
import { join } from 'path'
import loadConfig from './loadConfig'
import chalk from 'chalk'

export default async (directory: string, dev: boolean) => {
  let time = Date.now()

  const config = await loadConfig(directory)

  let imports = ''
  let routes = ''
  let finalRouter = await readFile(join(__dirname, './router.js'), { encoding: 'utf-8' })

  , sourceDirectory = join(directory, './src')
  , outDirectory = directory

  if (!existsSync(`${outDirectory}/.darkflare`)) await mkdir(`${outDirectory}/.darkflare`)
  if (!existsSync(`${outDirectory}/.darkflare/.cache`)) await mkdir(`${outDirectory}/.darkflare/.cache`)

  let hookExists = existsSync(`${sourceDirectory}/hooks/preValidation.ts`)

  const addHookToRoute = (endpoint: string) => {
    if (!hookExists) return ''

    for (let i of config.protect.strict) {
      if (endpoint.includes(i)) return ', preValidation.default'
    }
    
    for (let i of config.protect.flexible) {
      if (endpoint.includes(i)) return ', preValidation.default'
    }

    return ''
  }

  for await (let filePath of getFiles(sourceDirectory)) {
    if (filePath.includes('routes')) {
    
      let file = filePath.replace(sourceDirectory, '')
    
      file = {
        endpoint: file.replaceAll('[', ':').replaceAll(']', '').replace('.ts', '').replaceAll('\\', '/').replaceAll('/index', '').replace('/routes', ''),
        path: filePath.replace(sourceDirectory, './.cache').replace('.ts', '.js').replaceAll('\\', '/'),
        name: file.replace('\\', '').replaceAll('\\', '__').replaceAll('[', '_').replaceAll(']', '_').replace('.ts', '').replace(/[^a-zA-Z0-9_]/g, '$')
      }
    
    imports += `var ${file.name} = require("${file.path}")\n`
    
    await build({
      entryPoints: [filePath],
      bundle: false,
      minify: false,
      format: 'esm',
      outfile: filePath.replace(sourceDirectory, join(outDirectory, './.darkflare/.cache')).replace('.ts', '.js')
    })

    let content = await readFile(filePath.replace(sourceDirectory, join(outDirectory, './.darkflare/.cache')).replace('.ts', '.js'), { encoding: 'utf-8' })

    let methods = ''

    if (content.includes('get: async')) methods += 'GET, '
    if (content.includes('post: async')) methods += 'POST, '
    if (content.includes('patch: async')) methods += 'PATCH, '
    if (content.includes('put: async')) methods += 'PUT, '
    if (content.includes('delete: async')) methods += 'DELETE, '
    if (content.includes('head: async')) methods += 'HEAD, '

    methods = methods.substring(0, methods.length - 2)

    const strictProtection = () => {
      for (let i of config.protect.strict) {
        if (file.endpoint.includes(i)) return true
      }

      return false
    }

    const flexibleProtection = () => {
      for (let i of config.protect.flexible) {
        if (file.endpoint.includes(i)) return true
      }

      return false
    }

    const turnOnStrictProtection = !flexibleProtection() && strictProtection() === true
    
    routes += `
      .options('${file.endpoint}', cors('${methods}'))
      ${content.includes('get: async') ? `.get('${file.endpoint}', async request => { return await handler(request, ${turnOnStrictProtection}, ${file.name}.default.get${addHookToRoute(file.endpoint)}) })` : ''}
      ${content.includes('post: async') ? `.post('${file.endpoint}', async request => { return await handler(request, ${turnOnStrictProtection}, ${file.name}.default.post${addHookToRoute(file.endpoint)}) })` : ''}
      ${content.includes('patch: async') ? `.patch('${file.endpoint}', async request => { return await handler(request, ${turnOnStrictProtection}, ${file.name}.default.patch${addHookToRoute(file.endpoint)}) })` : ''}
      ${content.includes('put: async') ? `.put('${file.endpoint}', async request => { return await handler(request, ${turnOnStrictProtection}, ${file.name}.default.put${addHookToRoute(file.endpoint)}) })` : ''}
      ${content.includes('delete: async') ? `.delete('${file.endpoint}', async request => { return await handler(request, ${turnOnStrictProtection}, ${file.name}.default.delete${addHookToRoute(file.endpoint)}) })` : ''}
      ${content.includes('head: async') ? `.head('${file.endpoint}', async request => { return await handler(request, ${turnOnStrictProtection}, ${file.name}.default.head${addHookToRoute(file.endpoint)}) })` : ''}
    `
    } else if (!filePath.endsWith('.d.ts') && !filePath.endsWith('.test.ts') && filePath.endsWith('.ts')) {
      await build({
        entryPoints: [filePath],
        bundle: false,
        minify: false,
        format: 'esm',
        outfile: filePath.replace(sourceDirectory, join(outDirectory, './.darkflare/.cache')).replace('.ts', '.js')
      })
    } else if (filePath.endsWith('.json')) {
      await copyFile(filePath, filePath.replace(sourceDirectory, join(outDirectory, './.darkflare/.cache')))
    }
  }

  finalRouter = finalRouter
    .replace('/* <- INSERT_IMPORTS_HERE -> */', imports)
    .replace('/* <- INSERT_PREVALIDATION_HOOK_HERE -> */', `${hookExists ? 'var preValidation = require("./.cache/hooks/preValidation.js")' : ''}`)
    .replace('\n/* <- INSERT_ROUTES_HERE -> */', routes.replace(/^ +/gm, ''))
    .replace('/* <- INSERT_BASE_HERE -> */', `'${config.base}'`)
    .replaceAll('/* <- INSERT_ORIGIN_HERE -> */', `'${config.origin}'`)
    .replace('/* <- INSERT_DEV_HERE -> */', `'${dev ?? false}'`)

  await writeFile(join(outDirectory, './.darkflare/router.js'), finalRouter, { encoding: 'utf-8' })

  await copyFile(join(__dirname, './ittyRouter.js'), join(outDirectory, './.darkflare/ittyRouter.js'))

  await build({
    entryPoints: [join(outDirectory, './.darkflare/router.js')],
    bundle: true,
    minify: true,
    format: 'cjs',
    legalComments: 'none',
    outfile: join(outDirectory, './dist/worker.js')
  })

  const { size } = statSync(join(outDirectory, './dist/worker.js'))

  let readableTime = chalk.blackBright(`${Date.now() - time} ms`)
  let readableSize = chalk.blackBright(`${size / 1000} kB`)

  console.log(`${chalk.bold.inverse.greenBright(' RESULT ')}\n\n⏱️  ${chalk.blackBright(readableTime)}\n📦 ${chalk.blackBright(readableSize)}`)
}