import { readFile } from 'fs/promises'

export default async (directory: string) => {
  const raw = await readFile(`${directory}/darkflare.json`, { encoding: 'utf-8' })
  , config = JSON.parse(raw)

  return {
    base: config.base || '/',
    origin: config.origin || '*',
    protect: {
      strict: config.protect && config.protect.strict ? config.protect.strict : [],
      flexible: config.flexible && config.protect.flexible ? config.protect.flexible : []
    }
  }
}