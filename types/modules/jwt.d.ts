type Algorithm = ('ES256' | 'ES384' | 'ES512' | 'HS256' | 'HS384' | 'HS512' | 'RS256' | 'RS384' | 'RS512')

declare const jwtSign: (payload: object, secret: string, config?: {
  algorithm?: Algorithm | undefined,
  keyid?: string | undefined
} | Algorithm | undefined) => Promise<string>

declare const jwtVerify: (token: string, secret: string, config?: {
  algorithm?: Algorithm | undefined
} | Algorithm | undefined) => Promise<boolean>

declare const jwtDecode: (token: string) => { [key: string]: any } | null

export {
  jwtSign,
  jwtVerify,
  jwtDecode
}