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

  // ittyRouter
  await build({
    entryPoints: ['./src/modules/ittyRouter.ts'],
    bundle: true,
    minify: true,
    format: 'cjs',
    outfile: './dist/ittyRouter.js'
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