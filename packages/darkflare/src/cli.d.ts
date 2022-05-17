type Configuration = {
  base?: string,
  origin: string,
  handlePreflightRequests: boolean,
  modules: boolean,
  minify: boolean
}

type RouteObject = {
  endpoint: string,
  name: string,
  importPath: string,
  absolutePath: string
}

type MiddlewareObject = {
  name: string,
  importPath: string,
  absolutePath: string
}
