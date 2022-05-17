#!/usr/bin/env node

import { hideBin } from 'yargs/helpers'
import yargs from 'yargs'
import build from './commands/build'

yargs(hideBin(process.argv))
  .command('build', 'Create a production-ready build.', () => {}, args => build(process.cwd(), {
    dev: args.dev as boolean,
    testing: 0
  }))
  .option('dev', {
    type: 'boolean',
    description: 'Disable minification and enable additional error logging for your app.'
  })
  .demandCommand(1)
  .parse()
