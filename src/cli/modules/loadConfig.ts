import { readFile } from 'fs/promises'

export default async (directory: string) => {
  const config = await readFile(`${directory}/darkflare.json`, { encoding: 'utf-8' })
  return JSON.parse(config)
}