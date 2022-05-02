import jwt from '@tsndr/cloudflare-worker-jwt'

const sign = jwt.sign
, verify = jwt.verify
, decode = jwt.decode

export {
  sign,
  verify,
  decode
}