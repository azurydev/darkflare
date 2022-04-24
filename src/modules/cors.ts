export default (methods: string) => (request: any) => {
  try {
    const origin = '/* <- INSERT_ORIGIN_HERE -> */'
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
  } catch (err) {
    console.log(err)
  }
}