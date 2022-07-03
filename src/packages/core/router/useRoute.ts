import { respondWith } from './respondWith'
import { validate } from './validate'
import type { CloudflareRequest } from '../../../types/CloudflareRequest'
import type { DarkflareRequest } from '../../../types/DarkflareRequest'
import type { DarkflareResponse } from '../../../types/DarkflareResponse'
import type { Static, TSchema } from '@sinclair/typebox'

export const useRoute = <CustomBody = unknown, CustomQuery = unknown, CustomParameters = unknown, CustomHeaders = unknown, CustomCookies = unknown>(
  configuration: {
    schema?: {
      body?: CustomBody
      query?: CustomQuery
      parameters?: CustomParameters
      headers?: CustomHeaders
      cookies?: CustomCookies
    }
  },
  handler: (
    req: DarkflareRequest & {
      body: CustomBody extends TSchema ? Static<CustomBody> : unknown
      query: CustomQuery extends TSchema ? Static<CustomQuery> : unknown
      parameters: CustomParameters extends TSchema ? Static<CustomParameters> : unknown
      headers: CustomHeaders extends TSchema ? Static<CustomHeaders> : unknown
      cookies: CustomCookies extends TSchema ? Static<CustomCookies> : unknown
    },
    res: DarkflareResponse
  ) => Promise<string | object | void>
) => {
  return {
    configuration,
    handler: async (request: Request & CloudflareRequest & {
      query?: { [key: string]: string }
      parameters?: { [key: string]: string }
      __darkflare: {
        origin: string
        logging: boolean
      }
    }) => {
      let code = 200
      const headers: { [key: string]: string } = {}
      let payload: object | string | undefined

      const darkflareRequest: DarkflareRequest = {
        query: request.query ?? {},
        parameters: request.parameters ?? {},
        headers: {},
        cookies: {},
        body: {},
        env: request.env,
        ctx: request.ctx,
        ...request.cf
      }

      // query
      if (configuration.schema?.query && !validate(configuration.schema.query as any, darkflareRequest.query))
        return respondWith('Invalid Query Parameters', 418)

      // body
      try {
        const type = request.headers.get('content-type')

        if (type?.includes('application/json'))
          darkflareRequest.body = await request.json()
        else if (type?.includes('text/plain'))
          darkflareRequest.body = await request.text()
      } catch (err) {
        darkflareRequest.body = {}
      } finally {
        if (configuration.schema?.body && !validate(configuration.schema.body as any, darkflareRequest.body))
          return respondWith('Invalid Body', 418)
      }

      // headers
      for (const [key, value] of request.headers)
        darkflareRequest.headers[key] = value

      if (configuration.schema?.headers && !validate(configuration.schema.headers as any, darkflareRequest.headers))
        return respondWith('Invalid Headers', 418)

      // cookies
      try {
        darkflareRequest.cookies = (request.headers.get('Cookie') || '')
          .split(/;\s*/)
          .map(pair => pair.split(/=(.+)/))
          .reduce((acc: { [key: string]: string }, [key, value]) => {
            acc[key] = value
    
            return acc
          }, {})
      } catch (err) {
        darkflareRequest.cookies = {}
      } finally {
        if (configuration.schema?.cookies && !validate(configuration.schema.cookies as any, darkflareRequest.cookies))
          return respondWith('Invalid Cookies', 418)
      }

      const darkflareResponse: DarkflareResponse = {
        redirect: async (d, c) => {
          headers.location = d
          code = c ?? 307
        },
        code: async c => {
          code = c
        },
        header: async (n, v) => {
          headers[n] = v
        },
        cookie: async (n, v, c) => {
          let cookie = `${n}=${v};`

          headers['set-cookie'] = (
            c.expires && (cookie += ` expires=${c.expires.toUTCString()};`),
            c.maxAge && (cookie += ` max-age=${c.maxAge};`),
            c.domain && (cookie += ` domain=${c.domain};`),
            c.path && (cookie += ` path=${c.path};`),
            c.secure && (cookie += ' secure;'),
            c.httpOnly && (cookie += ' httpOnly;'),
            c.sameSite && (cookie += ` sameSite=${c.sameSite.charAt(0).toUpperCase() + c.sameSite.slice(1)};`),
            cookie
          )
        },
        json: async p => {
          payload = p
        },
        text: async p => {
          payload = p
        }
      }

      try {
        const p = await handler(darkflareRequest, darkflareResponse)

        if (!payload && p) payload = p

        if (payload && typeof payload === 'object') {
          if ((payload as { code: number }).code)
            code = (payload as { code: number }).code

          headers['content-type'] = 'application/json; charset=utf-8'
        } else if (payload && typeof payload === 'string') {
          headers['content-type'] = 'text/plain; charset=utf-8'
        }

        headers['access-control-allow-origin'] = request.__darkflare.origin

        if (payload)
          headers['content-length'] = typeof payload === 'string' ? payload.length.toString() : JSON.stringify(payload).length.toString()

        return new Response(typeof payload === 'string' ? payload : payload ? JSON.stringify(payload) : null, {
          headers,
          status: code
        })
      } catch (err) {
        if (request.__darkflare.logging)
          console.log(err)

        return respondWith('Something Went Wrong', 500)
      }
    }
  }
}
