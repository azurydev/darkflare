function router({ base = '', routes = [] } = {}) {
  return {
    __proto__: new Proxy({}, {
      // @ts-ignore
      get: (target, prop, receiver) => (route, ...handlers) =>
        routes.push([
          // @ts-ignore
          prop.toUpperCase(),
          // @ts-ignore
          RegExp(`^${(base + route)
            .replace(/(\/?)\*/g, '($1.*)?')                             // trailing wildcard
            .replace(/\/$/, '')                                         // remove trailing slash
            .replace(/:(\w+)(\?)?(\.)?/g, '$2(?<$1>[^/]+)$2$3')         // named params
            .replace(/\.(?=[\w(])/, '\\.')                              // dot in path
            .replace(/\)\.\?\(([^\[]+)\[\^/g, '?)\\.?($1(?<=\\.)[^\\.') // optional image format
          }/*$`),
          // @ts-ignore
          handlers,
        ]) && receiver
    }),
    routes,
    // @ts-ignore
    async handle (request, ...args) {
      let response, match, url = new URL(request.url)
      request.query = Object.fromEntries(url.searchParams)
      // @ts-ignore
      for (let [method, route, handlers] of routes) {
        if ((method === request.method || method === 'ALL') && (match = url.pathname.match(route))) {
          // @ts-ignore
          request.params = match.groups
          // @ts-ignore
          for (let handler of handlers) {
            // @ts-ignore
            if ((response = await handler(request.proxy || request, ...args)) !== undefined) return response
          }
        }

        /*
        else if (request.method === 'OPTIONS' && (match = url.pathname.match(route))) {
          return new Response()
        }
        */
      }
    }
  }
}

export default router as any
