const { Router } = require('./ittyRouter.js')

/* <- INSERT_IMPORTS_HERE -> */
/* <- INSERT_PREVALIDATION_HOOK_HERE -> */

const getCookieString = async (name, value, config) => {
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

const handler = async (request, strictProtection, handle, validationHook) => {
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
  
  for (let [key, value] of request.headers) {
    headers[key] = value
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

  const req = {
    query: request.query ?? {},
    params: request.params ?? {},
    headers,
    cookies,
    body,
    raw: request,
    ...request.cf
  }

  const res = {
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

  responseHeaders.set('access-control-allow-origin', /* <- INSERT_ORIGIN_HERE -> */)

try {
  if (typeof validationHook === 'function') {
    const preData = await validationHook(req, res)

    if (strictProtection) {
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

      return new Response(typeof preData === 'string' ? preData : preData ? JSON.stringify(preData) : null, {
        headers,
        status: responseCode
      })
    }
  }
} catch (err) {}
  /* */

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

const cors = methods => request => {
  const origin = /* <- INSERT_ORIGIN_HERE -> */
  const headers = '*'
  , maxAge = 86400

  if (request.headers.get('Origin') !== null && request.headers.get('Access-Control-Request-Method') !== null) {
    // handle pre-flight request
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Methods': methods,
        'Access-Control-Allow-Headers': headers,
        'Access-Control-Allow-Credentials': 'false',
        'Access-Control-Max-Age': maxAge.toString()
      }
    })
  }

  // handle standard request
  return new Response(null, {
    headers: {
      'Allow': `${methods}, HEAD, OPTIONS`
    }
  })
}

const router = Router({ base: /* <- INSERT_BASE_HERE -> */ })

, json = (message, code) => {
  const headers = new Headers()

  headers.set('content-type', 'application/json; charset=utf-8')
  headers.set('access-control-allow-origin', /* <- INSERT_ORIGIN_HERE -> */)

  return new Response(JSON.stringify({
    code,
    message
  }), {
    headers,
    status: code
  })
}

, errorHandler = async err => {
  if (/* <- INSERT_DEV_HERE -> */) {
    console.log(err.stack)
    console.log(err.message)
  }
  
  return json('Something Went Wrong', 500)
}

router
/* <- INSERT_ROUTES_HERE -> */

router.all('*', async () => {
  return json('Not Found', 404)
})

addEventListener('fetch', event =>
  event.respondWith(
    router
      .handle(event.request)
      .catch(errorHandler)
  )
)
