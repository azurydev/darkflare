import { DarkflareRequest } from './DarkflareRequest'
import { DarkflareResponse } from './DarkflareResponse'

export type Handler = (req: DarkflareRequest, res: DarkflareResponse) => Promise<{ code?: number, [key: string]: any } | string | void>
