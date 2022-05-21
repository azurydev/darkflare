import { DarkflareRequest } from './DarkflareRequest'
import { DarkflareResponse } from './DarkflareResponse'

export type Middleware<RequestObject = DarkflareRequest, ResponseObject = DarkflareResponse> = (req: RequestObject, res: ResponseObject) => Promise<{ code?: number, [key: string]: any } | string | void>
