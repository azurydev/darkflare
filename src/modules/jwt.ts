import jwt from '@tsndr/cloudflare-worker-jwt'

const jwtSign = jwt.sign
, jwtVerify = jwt.verify
, jwtDecode = jwt.decode

export {
  jwtSign,
  jwtVerify,
  jwtDecode
}