const getCookieString = async (name: string, value: string, config: {
  expires?: Date,
  maxAge?: number,
  domain?: string,
  path?: string,
  secure?: boolean,
  httpOnly?: boolean,
  sameSite?: 'Strict' | 'Lax' | 'None'
}) => {
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

export default getCookieString
