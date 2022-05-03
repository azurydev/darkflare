#!/usr/bin/env node

import { hideBin } from 'yargs/helpers'
import yargs from 'yargs'
import build from '../../packages/darkflare/src/modules/build'

yargs(hideBin(process.argv))
  .command('*', 'Create a production-ready build.', () => {}, (args) => build(process.cwd(), args.dev as boolean))
  .option('dev', {
    type: 'boolean',
    description: 'Run Darkflare in development mode.'
  })
  .demandCommand(0)
  .parse()
