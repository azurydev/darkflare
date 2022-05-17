const cors = (methods: string) => (request: Request) => {
  const headers = '*'
  , maxAge = 86400

  if (request.headers.get('Origin') !== null && request.headers.get('Access-Control-Request-Method') !== null) {
    // handle pre-flight request
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': ORIGIN,
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
