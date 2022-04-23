// @ts-ignore
import { Router } from './ittyRouter.js'

'/* <- INSERT_HANDLER_HERE -> */'
'/* <- INSERT_CORS_HANDLER_HERE -> */'

'/* <- INSERT_IMPORTS_HERE -> */'

const router = Router({ base: '/* <- INSERT_BASE_HERE -> */' })

, json = (message: string, code: number) => {
  const headers = new Headers()

  headers.set('content-type', 'application/json; charset=utf-8')
  headers.set('access-control-allow-origin', '/* <- INSERT_ORIGIN_HERE -> */')

  return new Response(JSON.stringify({
    code,
    message
  }), {
    headers,
    status: code
  })
}

, errorHandler = async (err: Error) => {
  if ('/* <- INSERT_DEV_HERE -> */') {
    console.log(err.stack)
    console.log(err.message)
  }
  
  return json('Something Went Wrong', 500)
}

router
'/* <- INSERT_ROUTES_HERE -> */'

router.all('*', async () => {
  return json('Not Found', 404)
})

addEventListener('fetch', (event: FetchEvent) =>
  event.respondWith(
    router
      .handle(event.request)
      .catch(errorHandler)
  )
)