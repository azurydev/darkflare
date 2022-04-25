interface DarkflareRequest extends IncomingRequestCfProperties {
  query: { [key: string]: any },
  params: { [key: string]: any },
  headers: { [key: string]: any },
  cookies: { [key: string]: any },
  body?: { [key: string]: any },
  raw: Request,
  [key: string]: any
}

type DarkflareResponse = {
  redirect: (destination: string, code: 300 | 301 | 302 | 303 | 304 | 307 | 308) => Promise<void>,
  code: (code: number) => Promise<void>,
  header: (name: string, value: string) => Promise<void>,
  cookie: (name: string, value: string, config?: {
    expires?: Date,
    maxAge?: number,
    domain?: string,
    path?: string,
    secure?: boolean,
    httpOnly?: boolean,
    sameSite?: 'Strict' | 'Lax' | 'None'
  }) => Promise<void>
}

type Method = (req: DarkflareRequest, res: DarkflareResponse) => Promise<{ code?: number, [key: string]: any } | string | void>

type Handler = {
  get?: (req: DarkflareRequest, res: DarkflareResponse) => Promise<{ code?: number, [key: string]: any } | string | void>,
  post?: (req: DarkflareRequest, res: DarkflareResponse) => Promise<{ code?: number, [key: string]: any } | string | void>,
  patch?: (req: DarkflareRequest, res: DarkflareResponse) => Promise<{ code?: number, [key: string]: any } | string | void>,
  put?: (req: DarkflareRequest, res: DarkflareResponse) => Promise<{ code?: number, [key: string]: any } | string | void>,
  delete?: (req: DarkflareRequest, res: DarkflareResponse) => Promise<{ code?: number, [key: string]: any } | string | void>,
  head?: (req: DarkflareRequest, res: DarkflareResponse) => Promise<{ code?: number, [key: string]: any } | string | void>
}

type Hook = (req: DarkflareRequest, res: DarkflareResponse) => Promise<{ code?: number, [key: string]: any } | string | void>

export {
  DarkflareRequest,
  DarkflareResponse,
  Method,
  Handler,
  Hook
}