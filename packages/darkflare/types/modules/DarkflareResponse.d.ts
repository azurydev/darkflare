export type DarkflareResponse = {
  /**
   * Redirect the incoming request.
   */
  redirect: (destination: string, code?: 300 | 301 | 302 | 303 | 304 | 307 | 308) => Promise<void>,
  /**
   * Modify the status code of the response.
   */
  code: (code: number) => Promise<void>,
  /**
   * Set a valid HTTP header.
   */
  header: (name: string, value: string) => Promise<void>,
  /**
   * Attach a cookie to the response.
   */
  cookie: (name: string, value: string, config?: {
    expires?: Date,
    maxAge?: number,
    domain?: string,
    path?: string,
    secure?: boolean,
    httpOnly?: boolean,
    sameSite?: 'Strict' | 'Lax' | 'None'
  }) => Promise<void>,
  /**
   * Modify the body of the response.
   */
  json: (data: object) => Promise<void>,
  /**
   * Modify the body of the response.
   */
  text: (data: string) => Promise<void>
}
