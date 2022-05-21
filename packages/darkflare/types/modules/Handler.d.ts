import { DarkflareRequest } from './DarkflareRequest'
import { DarkflareResponse } from './DarkflareResponse'

export type Handler<RequestObject = DarkflareRequest, ResponseObject = DarkflareResponse> = (req: RequestObject, res: ResponseObject) => Promise<{ code?: number, [key: string]: any } | string | void>
