#!/usr/bin/env node

import { hideBin } from 'yargs/helpers'
import yargs from 'yargs'
import create from './create'

yargs(hideBin(process.argv))
  .command('*', 'Create a new darkflare app.', () => {}, (args) => create(args.modules as boolean))
  .option('modules', {
    type: 'boolean',
    description: 'Create a new darkflare app in Module Workers format.'
  })
  .demandCommand(0)
  .parse()
