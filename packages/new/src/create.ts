#!/usr/bin/env node

import readline from 'readline'
import chalk from 'chalk'
import { copyFile, mkdir, writeFile } from 'fs/promises'
import { join } from 'path'
import { exec } from 'child_process'
import { ensureDir, copy } from 'fs-extra'

export default async (modules: boolean) => {
  // setup everything
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  , question: Question = (value: string) => new Promise(resolve => {
    console.clear()
    rl.question(`${chalk.bold.yellow('darkflare »')} ${chalk.blackBright(value)} \n ${chalk.blackBright('»')} `, resolve)
  })

  , execute = async (command: string) => exec(command, { cwd: directory })

  // get project name
  let name = await question('What do you want to call your new project? Press ENTER to skip.')
 
  if (name.length === 0)
    name = 'my-api'

  // create project directory
  let directory = await question('Where do you want to have the new project? Press ENTER to skip.')

  if (directory.length === 0) {
    directory = process.cwd()
  } else {
    directory = join(process.cwd(), directory.startsWith('../') || directory.startsWith('./') ? directory : `./${directory}`)
    await mkdir(directory)
  }

  // initialize package
  let packageJson = {
    name,
    version: '0.0.0',
    main: 'dist/worker.js',
    private: true,
    scripts: {
      deploy: 'wrangler publish --env production',
      build: 'darkflare build'
    },
    devDependencies: {},
    engines: {
      node: '>=16',
      npm: '>=8'
    }
  }

  // get base for api routes
  let base = await question('What base do you want to have for your app? Press ENTER to skip.')

  // get origin
  let origin = await question('What origin do you want to have for your API? Press ENTER to skip.')

  // copy gitignore
  await copyFile(join(__dirname, '../code/.gitignore'), join(directory, './.gitignore'))

  // generate app
  await writeFile(join(directory, './package.json'), JSON.stringify(packageJson, null, 2), { encoding: 'utf-8' })
  await execute('npm i -D darkflare @cloudflare/workers-types @types/node typescript')
  await writeFile(join(directory, './tsconfig.json'), JSON.stringify({
    compilerOptions: {
      target: 'esnext',
      module: modules ? 'es2020' : 'commonjs',
      lib: ['esnext'],
      rootDir: 'src',
      moduleResolution: 'node',
      esModuleInterop: true,
      forceConsistentCasingInFileNames: true,
      resolveJsonModule: true,
      alwaysStrict: true,
      strict: true,
      noImplicitReturns: true,
      noImplicitOverride: true,
      removeComments: true,
      noEmit: true,
      skipLibCheck: true,
      newLine: 'crlf',
      types: [
        '@cloudflare/workers-types'
      ]
    }
  }, null, 2))

  await writeFile(join(directory, './darkflare.json'), JSON.stringify({
    $schema: 'https://darkflare.run/schema.json',
    ...(!modules && { modules: false }),
    ...(base.length > 0 && { base }),
    ...(origin.length > 0 && { origin })
  }, null, 2))

  // get origin
  let copyRoutes = await question('Do you want to have some example routes? (y/n)')
  console.clear()

  // copy routes
  if (!copyRoutes || copyRoutes !== 'n') await copy(join(__dirname, '../code/routes'), join(directory, './src/routes'))
  else await ensureDir(join(directory, './src/routes'))

  await writeFile(join(directory, './src/routes/your_routes_here'), 'you can delete this file')

  // copy wrangler config
  if (modules) await copyFile(join(__dirname, '../code/moduleWorker.toml'), join(directory, './wrangler.toml'))
  else await copyFile(join(__dirname, '../code/serviceWorker.toml'), join(directory, './wrangler.toml'))

  console.log(chalk.bold.whiteBright('Woooowwww, there\'s your brand new app! 🎉') + chalk.italic.blackBright('\n(Wait until the node_modules folder appears)'))
}
