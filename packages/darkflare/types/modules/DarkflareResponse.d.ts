export type DarkflareResponse = {
  redirect: (destination: string, code?: 300 | 301 | 302 | 303 | 304 | 307 | 308) => Promise<void>,
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
  }) => Promise<void>,
  json: (data: object) => Promise<void>,
  text: (data: string) => Promise<void>
}
