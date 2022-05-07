import { readJson } from 'fs-extra'

const getConfiguration = async (directory: string) => {
  try {
    const config = await readJson(`${directory}/darkflare.json`)
  
    return {
      ...(config.base && { base: config.base }),
      origin: config.origin || '*',
      protect: {
        strict: config.protect && config.protect.strict ? config.protect.strict : [],
        flexible: config.flexible && config.protect.flexible ? config.protect.flexible : []
      }
    } as Configuration
  } catch (err) {
    return {
      origin: '*',
      protect: {
        strict: [],
        flexible: []
      }
    } as Configuration
  }
}

export default getConfiguration
