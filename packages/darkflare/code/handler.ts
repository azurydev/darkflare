import getCookieString from './getCookieString'

export interface IttyRequest extends Request {
  query: { [key: string]: any },
  params: { [key: string]: any },
  cf: IncomingRequestCfProperties
}

const handler = async (request: IttyRequest, handle: Function, env: any, context: any, middleware?: Function) => {
  try {
    let headers: { [key: string]: any } = {}
    , cookies = {}
    , body = {}
    , responseCode = 200
    , responseHeaders: { [key: string]: any } = {}
    , contentType = request.headers.get('content-type')
    , data
  
    try {
      if (contentType && contentType.includes('application/json'))
        body = await request.json()
    } catch (err) {
      body = {}
    }
    
    for (let [key, value] of request.headers)
      headers[key] = value
  
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
  
    const req = {
      query: request.query ?? {},
      params: request.params ?? {},
      headers,
      cookies,
      body,
      raw: request,
      env,
      context,
      ...request.cf
    }
  
    const res = {
      redirect: async (destination: string, code?: number) => {
        responseHeaders.location = destination
        responseCode = code || 307
      },
      code: async (code: number) => {
        responseCode = code
      },
      header: async (name: string, value: string) => {
        responseHeaders[name] = value
      },
      cookie: async (name: string, value: string, config: {
        expires?: Date,
        maxAge?: number,
        domain?: string,
        path?: string,
        secure?: boolean,
        httpOnly?: boolean,
        sameSite?: 'Strict' | 'Lax' | 'None'
      }) => {
        const cookieString = await getCookieString(name, value, config)
        responseHeaders['set-cookie'] = cookieString
      },
      json: async (d: object) => {
        data = d
      },
      text: async (d: string) => {
        data = d
      }
    }
  
    try {
      if (typeof middleware === 'function') {
        const preData = await middleware(req, res) || null
  
        if (preData && typeof preData === 'object' && preData.code) {
          responseCode = preData.code
          responseHeaders['content-type'] = 'application/json; charset=utf-8'
        } else if (preData && typeof preData === 'string') {
          responseHeaders['content-type'] = 'text/plain; charset=utf-8'
        }
  
        if (typeof responseHeaders.location === 'string') {
          return new Response(typeof preData === 'string' ? preData : preData ? JSON.stringify(preData) : null, {
            headers: responseHeaders,
            status: responseCode
          })
        }
  
        if (preData !== null) return new Response(typeof preData === 'string' ? preData : JSON.stringify(preData), {
          headers: responseHeaders,
          status: responseCode
        })
      }
    } catch (err) {}
    
    const d = await handle(req, res)
    if (!data) data = d
  
    if (data && typeof data === 'object' && data.code) {
      responseCode = data.code
      responseHeaders['content-type'] = 'application/json; charset=utf-8'
    } else if (data && typeof data === 'string') {
      responseHeaders['content-type'] = 'text/plain; charset=utf-8'
    }
  
    responseHeaders['access-control-allow-origin'] = ORIGIN
  
    if (data) responseHeaders['content-length'] = typeof data === 'string' ? data.length.toString() : JSON.stringify(data).length.toString()
  
    return new Response(typeof data === 'string' ? data : data ? JSON.stringify(data) : null, {
      headers: responseHeaders,
      status: responseCode
    })
  } catch (err) {
    if (LOGGING) console.log(err)

    return new Response(JSON.stringify({ code: 500, message: 'Something Went Wrong' }), {
      headers: {
        'content-type': 'application/json; charset=utf-8'
      },
      status: 500
    })
  }
}

export default handler
