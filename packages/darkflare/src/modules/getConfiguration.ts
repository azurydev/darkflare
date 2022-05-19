import fse from 'fs-extra'

const getConfiguration = async (directory: string) => {
  try {
    const config = await fse.readJson(`${directory}/darkflare.json`)
  
    return {
      ...(config.base && config.base !== '/' && { base: config.base }),
      origin: config.origin ?? '*',
      handlePreflightRequests: config.handlePreflightRequests ?? true,
      modules: config.modules ?? true,
      minify: config.minify ?? true
    } as Configuration
  } catch (err) {
    return {
      origin: '*',
      handlePreflightRequests: true,
      modules: true,
      minify: true
    } as Configuration
  }
}

export default getConfiguration
