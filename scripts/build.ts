import { build } from 'esbuild'

(async () => {
  // api
  await build({
    entryPoints: ['./src/api.ts'],
    bundle: true,
    minify: true,
    format: 'cjs',
    outfile: './dist/index.js'
  })

  // handler
  await build({
    entryPoints: ['./src/modules/handler.ts'],
    bundle: true,
    minify: true,
    format: 'cjs',
    outfile: './dist/handler.js'
  })

  // ittyRouter
  await build({
    entryPoints: ['./src/modules/ittyRouter.ts'],
    bundle: true,
    minify: true,
    format: 'cjs',
    outfile: './dist/ittyRouter.js'
  })

  // router
  await build({
    entryPoints: ['./src/modules/router.ts'],
    bundle: false,
    minify: false,
    format: 'cjs',
    outfile: './dist/router.js'
  })

  // cli
  await build({
    entryPoints: ['./src/cli/index.ts'],
    bundle: true,
    minify: true,
    format: 'cjs',
    external: ['esbuild'],
    platform: 'node',
    target: 'node16',
    outfile: './dist/cli.js'
  })
})()