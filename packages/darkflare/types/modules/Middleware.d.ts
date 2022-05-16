import { DarkflareRequest } from './DarkflareRequest'
import { DarkflareResponse } from './DarkflareResponse'

export type Middleware = (req: DarkflareRequest, res: DarkflareResponse) => Promise<{ code?: number, [key: string]: any } | string | void>
