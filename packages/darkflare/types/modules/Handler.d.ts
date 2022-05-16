import { DarkflareRequest } from './DarkflareRequest'
import { DarkflareResponse } from './DarkflareResponse'

export type Handler = {
  get?: (req: DarkflareRequest, res: DarkflareResponse) => Promise<{ code?: number, [key: string]: any } | string | void>,
  post?: (req: DarkflareRequest, res: DarkflareResponse) => Promise<{ code?: number, [key: string]: any } | string | void>,
  patch?: (req: DarkflareRequest, res: DarkflareResponse) => Promise<{ code?: number, [key: string]: any } | string | void>,
  put?: (req: DarkflareRequest, res: DarkflareResponse) => Promise<{ code?: number, [key: string]: any } | string | void>,
  delete?: (req: DarkflareRequest, res: DarkflareResponse) => Promise<{ code?: number, [key: string]: any } | string | void>,
  head?: (req: DarkflareRequest, res: DarkflareResponse) => Promise<{ code?: number, [key: string]: any } | string | void>
}
