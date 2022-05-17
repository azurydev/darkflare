interface IncomingRequestCfProperties {
  /**
   * (e.g. 395747)
   */
  asn: number,
  /**
   * The organisation which owns the ASN of the incoming request.
   * (e.g. Google Cloud)
   */
  asOrganization: string,
  botManagement?: IncomingRequestCfPropertiesBotManagement,
  city?: string,
  clientTcpRtt: number,
  clientTrustScore?: number,
  /**
   * The three-letter airport code of the data center that the request
   * hit. (e.g. "DFW")
   */
  colo: string,
  continent?: string,
  /**
   * The two-letter country code in the request. This is the same value
   * as that provided in the CF-IPCountry header. (e.g. "US")
   */
  country: string,
  httpProtocol: string,
  latitude?: string,
  longitude?: string,
  /**
   * DMA metro code from which the request was issued, e.g. "635"
   */
  metroCode?: string,
  postalCode?: string,
  /**
   * e.g. "Texas"
   */
  region?: string,
  /**
   * e.g. "TX"
   */
  regionCode?: string,
  /**
   * e.g. "weight=256,exclusive=1"
   */
  requestPriority: string,
  /**
   * e.g. "America/Chicago"
   */
  timezone?: string,
  tlsVersion: string,
  tlsCipher: string,
  tlsClientAuth: IncomingRequestCfPropertiesTLSClientAuth
}

interface IncomingRequestCfPropertiesBotManagement {
  score: number,
  staticResource: boolean,
  verifiedBot: boolean
}

interface IncomingRequestCfPropertiesTLSClientAuth {
  certIssuerDNLegacy: string,
  certIssuerDN: string,
  certPresented: '0' | '1',
  certSubjectDNLegacy: string,
  certSubjectDN: string,
  /**
   * In format "Dec 22 19:39:00 2018 GMT"
   */
  certNotBefore: string,
  /**
   * In format "Dec 22 19:39:00 2018 GMT"
   */
  certNotAfter: string,
  certSerial: string,
  certFingerprintSHA1: string,
  /**
   * "SUCCESS", "FAILED:reason", "NONE"
   */
  certVerified: string
}

export interface DarkflareRequest<Environment = { [key: string]: any }, > extends IncomingRequestCfProperties {
  query: { [key: string]: any },
  params: { [key: string]: any },
  headers: { [key: string]: any },
  cookies: { [key: string]: any },
  body?: { [key: string]: any },
  env?: Environment,
  context?: {
    waitUntil(promise: Promise<any>): void,
    passThroughOnException(): void
  },
  raw: Request,
  [key: string]: any
}
