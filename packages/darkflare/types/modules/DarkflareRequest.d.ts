export type DarkflareRequest<RequestParams = { [key: string]: any }, RequestEnv = undefined> = {
  /**
   * Parsed object of the query parameters of the incoming request.
   */
  query: { [key: string]: any }
  /**
   * Parsed object of the parameters of the incoming request.
   */
  params: RequestParams
  /**
   * Parsed object of the headers of the incoming request.
   */
  headers: { [key: string]: any }
  /**
   * Parsed object of the cookies of the incoming request.
   */
  cookies: { [key: string]: any }
  /**
   * Parsed object of the body of the incoming request.
   */
  body: { [key: string]: any }
  env?: RequestEnv
  ctx?: {
    waitUntil(promise: Promise<any>): void
    passThroughOnException(): void
  }
  /**
   * Unmodified `Request` object of the incoming request.
   */
  raw: Request
  /**
   * ASN of the incoming request, e.g. `395747`.
   */
  asn: number
  /**
   * The organization which owns the ASN of the incoming request, e.g. `Google Cloud`.
   */
  asOrganization: string
  /**
   * Only available when using **Cloudflare Bot Management**!
   * 
   * Object with the following properties: `score`, `verifiedBot`, `staticResource`, and `ja3Hash`.
   * 
   * Refer to [Bot Management Variables](https://developers.cloudflare.com/bots/reference/bot-management-variables) to learn more.
   */
  botManagement?: {
    score: number
    staticResource: boolean
    verifiedBot: boolean
  }
  /**
   * City of the incoming request, e.g. `Austin`.
   */
  city?: string
  /**
   * The three-letter [IATA](https://en.wikipedia.org/wiki/IATA_airport_code) airport code of the data center that the request hit, e.g. `DFW`.
   */
  colo: string
  /**
   * Continent of the incoming request, e.g. `NA`.
   */
  continent?: string
  /**
   * The two-letter country code of the incoming request, e.g. `US`.
   */
  country: string
  /**
   * HTTP Protocol of the incoming request, e.g. `HTTP/2`.
   */
  httpProtocol: string
  /**
   * Latitude of the incoming request, e.g. `30.27130`.
   */
  latitude?: string
  /**
   * Longitude of the incoming request, e.g. `-97.74260`.
   */
  longitude?: string
   /**
    * DMA metro code from which the request was issued, e.g. `635`.
    */
  metroCode?: string
  /**
   * Postal code of the incoming request, e.g. `78701`.
   */
  postalCode?: string
  /**
   * Region of the incoming request, e.g. `Texas`.
   */
  region?: string
  /**
   * Region code of the incoming request, e.g. `TX`.
   */
  regionCode?: string
  /**
   * The browser-requested prioritization information in the request object, e.g. `weight=192;exclusive=0;group=3;group-weight=127`.
   */
  requestPriority: string
  /**
   * Timezone of the incoming request, e.g. `America/Chicago`.
   */
  timezone?: string
  /**
   * The TLS version of the connection to Cloudflare, e.g. `TLSv1.3`.
   */
  tlsVersion: string
  /**
   * The cipher for the connection to Cloudflare, e.g. `AEAD-AES128-GCM-SHA256`.
   */
  tlsCipher: string
  /**
   * Only available when using **Cloudflare Access**!
   */
  tlsClientAuth: {
    certIssuerDNLegacy: string
    certIssuerDN: string
    certPresented: '0' | '1'
    certSubjectDNLegacy: string
    certSubjectDN: string
    /**
     * In format "Dec 22 19:39:00 2018 GMT"
     */
    certNotBefore: string
    /**
     * In format "Dec 22 19:39:00 2018 GMT"
     */
    certNotAfter: string
    certSerial: string
    certFingerprintSHA1: string
    /**
     * `SUCCESS`, `FAILED:reason`, or `NONE`.
     */
    certVerified: string
  }
}
