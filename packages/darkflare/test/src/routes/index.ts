import { Handler } from '../../../types'

export const Get: Handler = async () => {
  // test web crypto api (test if browser features work)
  crypto.randomUUID()

  return 'Hello World'
}

export const Post: Handler = async () => {
  return 'Hello World'
}

export const Patch: Handler = async () => {
  return 'Hello World'
}

export const Put: Handler = async () => {
  return 'Hello World'
}

export const Delete: Handler = async () => {
  return 'Hello World'
}

export const Head: Handler = async () => {
  return 'Hello World'
}
