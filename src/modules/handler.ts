import { DarkflareRequest, DarkflareResponse, Method } from '../../types/modules/router'

const getCookieString = async (name: string, value: string, config: any) => {
  let cookie = `${name}=${value};`

  return (
    config.expires && (cookie += ` expires=${config.expires.toUTCString()};`),
    config.maxAge && (cookie += ` max-age=${config.maxAge};`),
    config.domain && (cookie += ` domain=${config.domain};`),
    config.path && (cookie += ` path=${config.path};`),
    config.secure && (cookie += ' secure;'),
    config.httpOnly && (cookie += ' httpOnly;'),
    config.sameSite && (cookie += ` sameSite=${config.sameSite};`),
    cookie
  )
}

const handler = async (request: Request, handle: Method, validationHook?: Method) => {
  let headers = {}
  , cookies = {}
  , body = {}
  , responseCode = 200
  , responseHeaders = new Headers()
  , contentType = request.headers.get('content-type')

  try {
    if (contentType && contentType.includes('application/json'))
      body = await request.json()
  } catch (err) {
    body = {}
  }

  try {
    cookies = (request.headers.get('Cookie') || '')
      .split(/;\s*/)
      .map(pair => pair.split(/=(.+)/))
      .reduce((acc, [key, value]) => {
        // @ts-ignore
        acc[key] = value

        return acc
      }, {})
  } catch (err) {
    cookies = {}
  }

  const req: DarkflareRequest = {
    // @ts-ignore
    query: request.query ?? {},
    // @ts-ignore
    params: request.params ?? {},
    headers,
    cookies,
    body,
    raw: request,
    // @ts-ignore
    ...request.cf
  }

  const res: DarkflareResponse = {
    redirect: async (destination, code) => {
      responseHeaders.set('location', destination)
      responseCode = code ?? 307
    },
    code: async code => {
      responseCode = code
    },
    header: async (name, value) => {
      responseHeaders.set(name, value)
    },
    cookie: async (name, value, config) => {
      const cookieString = await getCookieString(name, value, config)
      responseHeaders.set('set-cookie', cookieString)
    }
  }

  responseHeaders.set('access-control-allow-origin', '/* <- INSERT_ORIGIN_HERE -> */')

  if (validationHook) {
    const preData = await validationHook(req, res)

    if (preData && typeof preData === 'object' && preData.code) {
      responseCode = preData.code
      responseHeaders.set('content-type', 'application/json; charset=utf-8')
    } else if (preData && typeof preData === 'string') {
      responseHeaders.set('content-type', 'text/plain; charset=utf-8')
    }
    
    if (responseHeaders.get('location') !== null) {
      return new Response(typeof preData === 'string' ? preData : preData ? JSON.stringify(preData) : null, {
        headers,
        status: responseCode
      })
    }
  }

  const data = await handle(req, res)

  if (data && typeof data === 'object' && data.code) {
    responseCode = data.code
    responseHeaders.set('content-type', 'application/json; charset=utf-8')
  } else if (data && typeof data === 'string') {
    responseHeaders.set('content-type', 'text/plain; charset=utf-8')
  }

  return new Response(typeof data === 'string' ? data : data ? JSON.stringify(data) : null, {
    headers,
    status: responseCode
  })
}

export default handler