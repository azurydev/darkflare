type Configuration = {
  base?: string,
  origin: string,
  handlePreflightRequests: boolean,
  modules: boolean,
  minify: boolean
}

type Route = {
  endpoint: string,
  name: string,
  importPath: string,
  absolutePath: string
}

type Middleware = {
  name: string,
  importPath: string,
  absolutePath: string
}
