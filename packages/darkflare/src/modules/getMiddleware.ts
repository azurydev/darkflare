import { customAlphabet } from 'nanoid/async'

const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 16)

const getMiddleware = async (file: string) => {
  return {
    name: await nanoid() + file
      .substring(file.indexOf('routes') + 6)
      .replace('\\', '')
      .replaceAll('\\', '__')
      .replaceAll('[', '_')
      .replaceAll(']', '_')
      .replace('.ts', '')
      .replace(/[^a-zA-Z_]/g, '$'),
    importPath: file
      .substring(file.indexOf('routes'))
      .replaceAll('\\', '/')
      .replaceAll('\/', '/')
      .replace('.ts', ''),
    absolutePath: file
  }
}

export default getMiddleware
