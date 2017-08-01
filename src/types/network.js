// @flow
// https://chromedevtools.github.io/devtools-protocol/tot/Network/

import type { FrameId, ResourceType } from './page';
import type { StackTrace } from './runtime';
import type { SecurityState, CertificateId, MixiedContentType } from './security';

export type Timestamp = number;

/**
 * Unique loader identifier.
 */
export type LoaderId = string;

/**
 * Unique request identifier.
 */
export type RequestId = string;

/**
 * Unique intercepted request identifier.
 */
export type InterceptionId = string;

/**
 * Network level fetch failure reason.
 */
export type ErrorReason = "Failed" | "Aborted" | "TimedOut" | "AccessDenied" |
                   "ConnectionClosed" | "ConnectionReset" | "ConnectionRefused" |
                   "ConnectionAborted" | "ConnectionFailed" | "NameNotResolved" |
                   "InternetDisconnected" | "AddressUnreachable";

/**
 * UTC time in seconds, counted from January 1, 1970.
 */
export type TimeSinceEpoch = number;

/**
 * Monotonically increasing time in seconds since an arbitrary point in the past.
 */
export type MonotonicTime = number;

/**
 * Request / response headers as keys / values of JSON object.
 */
export type Headers = Object;

/**
 * Loading priority of a resource request.
 */
export type ConnectionType = "none" | "cellular2g" | "cellular3g" | "cellular4g" | "bluetooth" | "ethernet" | "wifi" | "wimax" | "other";

/**
 * Represents the cookie's 'SameSite' status: https://tools.ietf.org/html/draft-west-first-party-cookies
 */
export type CookieSameSite = "Strict" | "Lax";

/**
 * Timing information for the request.
 */
export type ResourceTiming = {
  requestTime: number,
  proxyStart: number,
  proxyEnd: number,
  dnsStart: number,
  dnsEnd: number,
  connectStart: number,
  connectEnd: number,
  sslStart: number,
  sslEnd: number,
  workerStart: number,
  workerReady: number,
  sendStart: number,
  sendEnd: number,
  pushStart: number,
  pushEnd: number,
  receiveHeadersEnd: number,
};

/**
 * Loading priority of a resource request.
 */
export type ResourcePriority = "VeryLow" | "Low" | "Medium" | "High" | "VeryHigh";

/**
 * The referrer policy of the request, as defined in https://www.w3.org/TR/referrer-policy/
 * Allowed values: unsafe-url, no-referrer-when-downgrade, no-referrer, origin,
 * origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin.
 */
export type ReferrerPolicy = "unsafe-url" | "no-referrer-when-downgrade" | "no-referrer" | "origin" |
                            "origin-when-cross-origin" | "no-referrer-when-downgrade-origin-when-cross-origin";

/**
 * HTTP request data.
 */
export type Request = {
  url: string,
  method: string,
  headers: Headers,
  postData?: string,
  mixedContentType?: MixiedContentType,
  initialPriority: ResourcePriority,
  referrerPolicy: ReferrerPolicy,
  isLinkPreload?: boolean,
};

/**
 * Details of a signed certificate timestamp (SCT).
 */
export type SignedCertificateTimestamp = {
  status: string,
  origin: string,
  logDescription: string,
  logId: string,
  timestamp: TimeSinceEpoch,
  hashAlgorithm: string,
  signatureAlgorithm: string,
  signatureData: string,
};

/**
 * Security details about a request.
 */
export type SecurityDetails = {
  protocol: string,
  keyExchange: string,
  keyExchangeGroup?: string,
  cipher: string,
  mac?: string,
  certificateId: CertificateId,
  subjectName: string,
  sanList: Array<string>,
  issuer: string,
  validFrom: TimeSinceEpoch,
  validTo: TimeSinceEpoch,
  signedCertificateTimestampList: Array<SignedCertificateTimestamp>,
};

/**
 * The reason why request was blocked.
 *
 * EXPERIMENTAL
 */
export type BlockedReason = "csp" | "mixed-content" | "origin" | "inspector" | "subresource-filter" | "other";

/**
 * HTTP response data.
 */
export type Response = {
  url: string,
  status: number,
  statusText: string,
  headers: Headers,
  headersText?: string,
  mimeType: string,
  requestHeaders?: Headers,
  requestHeadersText?: string,
  connectionReused: boolean,
  connectionId: number,
  remoteIPAddress: string,
  remotePort?: number,
  fromDiskCache: boolean,
  fromServiceWorker: boolean,
  encodedDataLength: number,
  timing?: ResourceTiming,
  protocol?: string,
  securityState: SecurityState,
  securityDetails?: SecurityDetails,
};

/**
 * WebSocket request data.
 *
 * EXPERIMENTAL
 */
export type WebSocketRequest = {
  headers: Headers,
}

/**
 * WebSocket response data.
 *
 * EXPERIMENTAL
 */
export type WebSocketResponse = {
  status: number,
  statusText: string,
  headers: Headers,
  headersText?: string,
  requestHeaders?: Headers,
  requestHeadersText?: string,
};

/**
 * WebSocket frame data.
 *
 * EXPERIMENTAL
 */
export type WebSocketFrame = {
  opcode: Number,
  mask: boolean,
  payloadData: string,
};

/**
 * Information about the cached resource.
 */
export type CachedResource = {
  url: string,
  type: ResourceType,
  response?: Response,
  bodySize: number,
};

/**
 * Information about the request initiator.
 */
export type Initiator = {
  type: "parser" | "script" | "other",
  stack?: StackTrace,
  url?: string,
  lineNumber?: number
};

/**
 * Cookie object
 *
 * EXPERIMENTAL
 */
export type Cookie = {
  name: string,
  value: string,
  domain: string,
  path: string,
  expires: number,
  size: number,
  httpOnly: boolean,
  secure: boolean,
  session: boolean,
  sameSite?: CookieSameSite
};

/**
 * Authorization challenge for HTTP status code 401 or 407.
 *
 * EXPERIMENTAL
 */
export type AuthChallenge = {
  source?: "Server" | "Proxy",
  origin: string,
  schema: string,
  realm: string,
};

/**
 * Response to an AuthChallenge.
 *
 * EXPERIMENTAL
 */
export type AuthChallengeResponse = {
  response: "Default" | "CancelAuth" | "ProvideCredentials",
  username?: string,
  password?: string,
};

export type Network = {
  /**
   * Enables network tracking, network events will now be delivered to the client.
   */
  enable(arg?: {
    maxTotalBufferSize?: Number,
    maxResourceBufferSize?: Number
  }): Promise<{}>;

  /**
   * Disables network tracking, prevents network events from being sent to the client.
   */
  disable(): Promise<{}>;

  /**
   * Allows overriding user agent with the given string.
   */
  setUserAgentOverride(arg: {userAgent: string}): Promise<{}>;

  /**
   * Specifies whether to always send extra HTTP headers with the requests from this page.
   */
  setExtraHTTPHeaders(arg: {headers: Headers}): Promise<{}>;

  /**
   * Returns content served for the given request.
   */
  getResponseBody(arg: {requestId: RequestId}): Promise<{
    body: string,
    base64Encoded: boolean
  }>;

  /**
   * Blocks URLs from loading.
   *
   * EXPERIMENTAL
   */
  setBlockedURLs(): Promise<{urls: Array<string>}>;

  /**
   * This method sends a new XMLHttpRequest which is identical to the original one.
   * The following parameters should be identical:
   * method, url, async, request body, extra headers, withCredentials attribute, user, password.
   *
   * EXPERIMENTAL
   */
  replayXHR(arg: {requestId: RequestId}): Promise<>;

  /**
   * Tells whether clearing browser cache is supported.
   */
  canClearBrowserCache(): Promise<{result: boolean}>;

  /**
   * Clears browser cache.
   */
  clearBrowserCache(): Promise<{}>;

  /**
   * Tells whether clearing browser cookies is supported.
   */
  canClearBrowserCookies(): Promise<{result: boolean}>;

  /**
   * Clears browser cookies.
   */
  clearBrowserCookies(): Promise<>;

  /**
   * Returns all browser cookies for the current URL.
   * Depending on the backend support, will return detailed cookie information in the cookies field.
   *
   * EXPERIMENTAL
   */
  getCookies(arg: {urls?: Array<string>}): Promise<{cookies: Array<Cookie>}>;

  /**
   * Returns all browser cookies. Depending on the backend support,
   * will return detailed cookie information in the cookies field. EXPERIMENTAL
   *
   * EXPERIMENTAL
   */
  getAllCookies(): Promise<{cookies: Array<Cookie>}>;

  /**
   * Deletes browser cookie with given name, domain and path.
   *
   * EXPERIMENTAL
   */
  deleteCookie(arg: {cookieName: string, url: string}): Promise<>;

  /**
   * Sets a cookie with the given cookie data; may overwrite equivalent cookies if they exist.
   *
   * EXPERIMENTAL
   */
  setCookie(arg: {
    url: string,
    name: string,
    value: string,
    domain?: string,
    path?: string,
    secure?: boolean,
    httpOnly?: boolean,
    sameSite?: CookieSameSite,
    expirationDate?: TimeSinceEpoch
  }): Promise<{success: boolean}>;

  /**
   * Tells whether emulation of network conditions is supported.
   *
   * EXPERIMENTAL
   */
  canEmulateNetworkConditions(): Promise<{result: boolean}>;

  /**
   * Activates emulation of network conditions.
   */
  emulateNetworkConditions(arg: {
    offline: boolean,
    latency: Number,
    downloadThroughput: Number,
    uploadThroughput: Number,
    connectionType?: ConnectionType
  }): Promise<{}>;

  /**
   * Toggles ignoring cache for each request. If true, cache will not be used.
   */
  setCacheDisabled(arg: {cacheDisabled: boolean}): Promise<{}>;

  /**
   * Toggles ignoring of service worker for each request.
   *
   * EXPERIMENTAL
   */
  setBypassServiceWorker(arg: {bypass: boolean}): Promise<{}>;

  /**
   * For testing.
   *
   * EXPERIMENTAL
   */
  setDataSizeLimitsForTest(arg: {maxTotalSize: number, maxResourceSize: number}): Promise<{}>;

  /**
   * Returns the DER-encoded certificate.
   *
   * EXPERIMENTAL
   */
  getCertificate(arg: {origin: string}): Promise<{ tableNames: Array<string> }>;

  /**
   * Whether or not HTTP requests
   * should be intercepted and Network.requestIntercepted events sent.
   *
   * EXPERIMENTAL
   */
  enableRequestInterception(arg: {enabled: boolean}): Promise<>;

  /**
   * Response to Network.requestIntercepted
   * which either modifies the request
   * to continue with any modifications, or blocks it, or completes
   * it with the provided response bytes.
   * If a network fetch occurs as a result which encounters a redirect an additional
   * Network.requestIntercepted event will be sent with the same InterceptionId.
   *
   * EXPERIMENTAL
   */
  continueInterceptedRequest(arg: {
    interceptionId: InterceptionId,
    errorReason?: ErrorReason,
    rawResponse?: string,
    url?: string,
    method?: string,
    postData?: string,
    headers?: Headers,
    authChallengeResponse: AuthChallengeResponse
  }): Promise<>;


  /* Events */

  /**
   * Fired when resource loading priority is changed
   *
   * EXPERIMENTAL
   */
  resourceChangedPriority(callback: (
    requestId: RequestId,
    newPriority: ResourcePriority,
    timestamp: MonotonicTime
  ) => any): any;

  /**
   * Fired when page is about to send HTTP request.
   */
  requestWillBeSent(callback: (
    requestId: RequestId,
    loaderId: LoaderId,
    documentURL: string,
    request: Request,
    timestamp: MonotonicTime,
    wallTime: TimeSinceEpoch,
    initiator: Initiator,
    redirectResponse?: Response,
    type?: ResourceType,
    frameId?: FrameId
  ) => any): any;

  /**
   * Fired if request ended up loading from cache.
   */
  requestServedFromCache(callback: (
    requestId: RequestId
  ) => any): any;

  /**
   * Fired when HTTP response is available.
   */
  responseReceived(callback: (
    requestId: RequestId,
    loaderId: LoaderId,
    timestamp: MonotonicTime,
    type: ResourceType,
    response: Response,
    frameid: FrameId
  ) => any): any;

  /**
   * Fired when data chunk was received over the network.
   */
  dataReceived(callback: (
    requestId: RequestId,
    timestamp: MonotonicTime,
    dataLength: number,
    encodedDataLength: number
  ) => any): any;

  /**
   * Fired when HTTP request has finished loading.
   */
  loadingFinished(callback: (
    requestId: RequestId,
    timestamp: MonotonicTime,
    encodedDataLength: number
  ) => any): any;

  /**
   * Fired when HTTP request has failed to load.
   */
  loadingFailed(callback: (
    requestId: RequestId,
    timestamp: MonotonicTime,
    type: ResourceType,
    errorText: string,
    canceled?: boolean,
    blockedReason?: BlockedReason
  ) => any): any;

  /**
   * Fired when WebSocket is about to initiate handshake.
   *
   * EXPERIMENTAL
   */
  webSocketWillSendHandshakeRequest(callback: (
    requestId: RequestId,
    timestamp: MonotonicTime,
    wallTime: TimeSinceEpoch,
    request: WebSocketRequest
  ) => any): any;

  /**
   * Fired when WebSocket handshake response becomes available.
   *
   * EXPERIMENTAL
   */
  webSocketHandshakeResponseReceived(callback: (
    requestId: RequestId,
    timestamp: MonotonicTime,
    response: WebSocketResponse
  ) => any): any;

  /**
   * Fired upon WebSocket creation.
   *
   * EXPERIMENTAL
   */
  webSocketCreated(callback: (
    requestId: RequestId,
    url: string,
    initiator?: Initiator
  ) => any): any;

  /**
   * Fired when WebSocket is closed.
   *
   * EXPERIMENTAL
   */
  webSocketClosed(callback: (
    requestId: RequestId,
    timestamp: MonotonicTime
  ) => any): any;

  /**
   * Fired when WebSocket frame is received.
   *
   * EXPERIMENTAL
   */
  webSocketFrameReceived(callback: (
    requestId: RequestId,
    timestamp: MonotonicTime,
    response: WebSocketFrame
  ) => any): any;

  /**
   * Fired when WebSocket frame error occurs.
   *
   * EXPERIMENTAL
   */
  webSocketFrameError(callback: (
    requestId: RequestId,
    timestamp: MonotonicTime,
    errorMessage: string,
  ) => any): any;

  /**
   * Fired when WebSocket frame is sent.
   *
   * EXPERIMENTAL
   */
  webSocketFrameSent(callback: (
    requestId: RequestId,
    timestamp: MonotonicTime,
    response: WebSocketFrame
  ) => any): any;

  /**
   * Fired when EventSource message is received.
   *
   * EXPERIMENTAL
   */
  eventSourceMessageReceived(callback: (
    requestId: RequestId,
    timestamp: MonotonicTime,
    eventName: string,
    eventId: string,
    data: string
  ) => any): any;

  /**
   * Details of an intercepted HTTP request,
   * which must be either allowed, blocked, modified or mocked.
   *
   * EXPERIMENTAL
   */
  requestIntercepted(callback: (
    InterceptionId: InterceptionId,
    request: Request,
    resourceType: ResourceType,
    redirectHeaders?: Headers,
    redirectStatusCode?: number,
    redirectUrl?: string,
    authChallenge?: AuthChallenge
  ) => any): any;
};
