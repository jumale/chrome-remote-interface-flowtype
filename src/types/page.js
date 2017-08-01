// @flow
// from: https://chromedevtools.github.io/devtools-protocol/tot/Page/

import type { LoaderId, Timestamp, MonotonicTime } from './network';
import type { SearchMatch } from './debugger';
import type { Rect } from './dom';
import type { StackTrace, ExecutionContextId } from './runtime';

/**
 * Resource type as it was perceived by the rendering engine.
 */
export type ResourceType = "Document" | "Stylesheet" | "Image" | "Media" |
                           "Font" | "Script" | "TextTrack" | "XHR" | "Fetch" |
                           "EventSource" | "WebSocket" | "Manifest" | "Other";

/**
 * Unique frame identifier.
 */
export type FrameId = string;

/**
 * Information about the Frame on the page.
 */
export type Frame = {
  id: string,
  parentId?: string,
  loaderId: LoaderId,
  name?: string,
  securityOrigin: string,
  mimeType: string,
};

/**
 * Information about the Resource on the page.
 *
 * EXPERIMENTAL
 */
export type FrameResource = {
  url: string,
  type: ResourceType,
  mimeType: string,
  lasModified?: Timestamp,
  contentSize?: number,
  failed: Boolean,
  canceled: Boolean
};

/**
 * Information about the Frame hierarchy along with their cached resources.
 *
 * EXPERIMENTAL
 */
export type FrameResourceTree = {
  frame: Frame,
  childFrames: Array<FrameResourceTree>,
  resources: Array<FrameResource>
}

/**
 * Transition type.
 *
 * EXPERIMENTAL
 */
export type TransitionType = "link" | "typed" | "auto_bookmark" | "auto_subframe" |
                      "manual_subframe" | "generated" | "auto_toplevel" |
                      "form_submit" | "reload" | "keyword" | "keyword_generated" | "other";

/**
 * Navigation history entry.
 *
 * EXPERIMENTAL
 */
export type NavigationEntry = {
  id: number,
  url: string,
  userTypedURL: string,
  title: string,
  transitionType: TransitionType
};

/**
 * Error while paring app manifest.
 *
 * EXPERIMENTAL
 */
export type AppManifestError = {
  message: string,
  critical: number,
  line: number,
  column: number,
};

/**
 * Proceed: allow the navigation;
 * Cancel: cancel the navigation;
 * CancelAndIgnore: cancels the navigation and makes the requester of
 * the navigation acts like the request was never made.
 *
 * EXPERIMENTAL
 */
export type NavigationResponse = "Proceed" | "Cancel" | "CancelAndIgnore";

/**
 * Viewport for capturing screenshot.
 *
 * EXPERIMENTAL
 */
export type Viewport = {
  x: number,
  y: number,
  width: number,
  height: number,
  scale: number,
};

/**
 * Layout viewport position and dimensions.
 *
 * EXPERIMENTAL
 */
export type LayoutViewport = {
  pageX: number,
  pageY: number,
  clientWidth: number,
  clientHeight: number
};

/**
 * Visual viewport position, dimensions, and scale.
 *
 * EXPERIMENTAL
 */
export type VisualViewport = {
  offsetX: number,
  offsetY: number,
  pageX: number,
  pageY: number,
  clientWidth: number,
  clientHeight: number,
  scale: number,
};

/**
 * Screencast frame metadata.
 *
 * EXPERIMENTAL
 */
export type ScreencastFrameMetadata = {
  offsetTop: number,
  pageScaleFactor: number,
  deviceWidth: number,
  deviceHeight: number,
  scrollOffsetX: number,
  scrollOffsetY: number,
  timestamp: number
};

/**
 * Unique script identifier.
 *
 * EXPERIMENTAL
 */
export type ScriptIdentifier = string;

/**
 * Javascript dialog type.
 *
 * EXPERIMENTAL
 */
export type DialogType = "alert" | "confirm" | "prompt" | "beforeunload";

/**
 * @type {Object}
 */
export type Page = {
  /**
   * Enables page domain notifications.
   */
  enable(): Promise<{}>;

  /**
   * Disables page domain notifications.
   */
  disable(): Promise<{}>;

  /**
   * Deprecated,
   * please use addScriptToEvaluateOnNewDocument instead.
   *
   * EXPERIMENTAL
   * DEPRECATED
   */
  addScriptToEvaluateOnLoad(arg: {
    scriptSource: string
  }): Promise<{
    identifier: ScriptIdentifier
  }>;

  /**
   * Deprecated,
   * please use removeScriptToEvaluateOnNewDocument instead.
   *
   * EXPERIMENTAL
   * DEPRECATED
   */
  removeScriptToEvaluateOnLoad(arg: {
    identifier: ScriptIdentifier
  }): Promise<>;

  /**
   * Evaluates given script in every frame upon creation
   * (before loading frame's scripts).
   *
   * EXPERIMENTAL
   */
  addScriptToEvaluateOnNewDocument(arg: {
    source: string
  }): Promise<{ identifier: ScriptIdentifier }>;

  /**
   * Removes given script from the list.
   *
   * EXPERIMENTAL
   */
  removeScriptToEvaluateOnNewDocument(arg: {
    identifier: ScriptIdentifier
  }): Promise<>;

  /**
   * Controls whether browser will open a new inspector window for connected pages.
   *
   * EXPERIMENTAL
   */
  setAutoAttachToCreatedPages(arg: {
    autoAttach: boolean
  }): Promise<>;

  /**
   * Reloads given page optionally ignoring the cache.
   */
  reload(arg?: {ignoreCache?: Boolean, scriptToEvaluateOnLoad?: string}): Promise<>;

  /**
   * Navigates current page to the given URL.
   */
  navigate(arg: {
    url: string,
    referrer?: string,
    trasitionType?: TransitionType
  }): Promise<{ frameId: FrameId }>;

  /**
   * Force the page stop all navigations and pending resource fetches.
   *
   * EXPERIMENTAL
   */
  stopLoading(): Promise<>;

  /**
   * Returns navigation history for the current page. EXPERIMENTAL
   *
   * EXPERIMENTAL
   */
  getNavigationHistory(): Promise<{
    currentIndex: number, entries: Array<NavigationEntry>
  }>;

  /**
   * Navigates current page to the given history entry.
   *
   * EXPERIMENTAL
   */
  navigateToHistoryEntry(arg: { entryId: number }): Promise<>;

  /**
   * Returns present frame / resource tree structure.
   *
   * EXPERIMENTAL
   */
  getResourceTree(): Promise<{ frameTree: FrameResourceTree }>;

  /**
   * Returns content of the given resource.
   *
   * EXPERIMENTAL
   */
  getResourceContent(arg: {
    frameId: FrameId,
    url: string
  }): Promise<{
    content: string,
    base64Encoded: string
  }>;

  /**
   * Searches for given string in resource content.
   *
   * EXPERIMENTAL
   */
  searchInResource(arg: {
    frameId: FrameId,
    url: string,
    query: string,
    caseSensitive?: boolean,
    isRegex?: boolean
  }): Promise<{result: Array<SearchMatch>}>;

  /**
   * Sets given markup as the document's HTML.
   *
   * EXPERIMENTAL
   */
  setDocumentContent(arg: {frameId: FrameId, html: string}): Promise<>;

  /**
   * Capture page screenshot.
   *
   * EXPERIMENTAL
   */
  captureScreenshot(arg?: {
    format?: "jpeg" | "png",
    quality?: number,
    clip?: Viewport,
    fromSurface?: boolean
  }): Promise<{data: string}>;

  /**
   * Print page as PDF.
   *
   * EXPERIMENTAL
   */
  printToPDF(arg?: {
    landscape?: boolean,
    displayHeaderFooter?: boolean,
    printBackground?: boolean,
    scale?: number,
    paperWidth?: number,
    paperHeight?: number,
    marginTop?: number,
    marginBottom?: number,
    marginLeft?: number,
    marginRight?: number,
    pageRanges?: string
  }): Promise<{data: string}>;

  /**
   * Starts sending each frame using the screencastFrame event.
   *
   * EXPERIMENTAL
   */
  startScreencast(arg?: {
    format?: "jpeg" | "png",
    quality?: number,
    maxWidth?: number,
    maxHeight?: number,
    everyNthFrame?: number
  }): Promise<>;

  /**
   * Stops sending each frame in the screencastFrame.
   *
   * EXPERIMENTAL
   */
  stopScreencast(): Promise<>;

  /**
   * Acknowledges that a screencast frame has been received by the frontend.
   *
   * EXPERIMENTAL
   */
  screencastFrameAck(arg: {seccionId: number}): Promise<>;

  /**
   * Accepts or dismisses a JavaScript initiated dialog (alert, confirm, prompt, or onbeforeunload).
   */
  handleJavaScriptDialog(arg: {accept: boolean, promptText?: string}): Promise<>;

  /**
   * EXPERIMENTAL
   */
  getAppManifest(): Promise<{
    url: string,
    errors: Array<AppManifestError>,
    data?: string
  }>;

  /**
   * EXPERIMENTAL
   */
  requestAppBanner(): Promise<>;

  /**
   * Toggles navigation throttling
   * which allows programatic control over navigation and redirect response.
   *
   * EXPERIMENTAL
   */
  setControlNavigations(arg: {enable: boolean}): Promise<>;

  /**
   * Should be sent in response to a navigationRequested or a redirectRequested event,
   * telling the browser how to handle the navigation.
   *
   * EXPERIMENTAL
   */
  processNavigation(arg: {response: NavigationResponse, navigationId: number}): Promise<>;

  /**
   * Returns metrics relating to the layouting of the page,
   * such as viewport bounds/scale.
   *
   * EXPERIMENTAL
   */
  getLayoutMetrics(): Promise<{
    layoutViewport: LayoutViewport,
    visualViewport: VisualViewport,
    contentSize: Rect
  }>;

  /**
   * Creates an isolated world for the given frame.
   *
   * EXPERIMENTAL
   */
  createIsolatedWorld(arg: {
    frameId: FrameId,
    worldName?: string,
    grantUniveralAccess?: boolean
  }): Promise<{ executionContextId: ExecutionContextId }>;

  /* -- events -- */

  /**
   */
  domContentEventFired(
    callback: (timestamp: MonotonicTime) => any
  ): any;

  /**
   */
  loadEventFired(
    callback: (timestamp: MonotonicTime) => any
  ): any;

  /**
   * Fired when frame has been attached to its parent.
   */
  frameAttached(callback: (
    frameId: FrameId,
    parentFrameId: FrameId,
    stack?: StackTrace
  ) => any): any;

  /**
   * Fired once navigation of the frame has completed.
   * Frame is now associated with the new loader.
   */
  frameNavigated(callback: (frame: Frame) => any): any;

  /**
   * Fired when frame has been detached from its parent.
   */
  frameDetached(callback: (frameId: FrameId) => any): any;

  /**
   * Fired when frame has started loading.
   *
   * EXPERIMENTAL
   */
  frameStartedLoading(callback: (frameId: FrameId) => any): any;

  /**
   * Fired when frame has stopped loading.
   *
   * EXPERIMENTAL
   */
  frameStoppedLoading(callback: (frameId: FrameId) => any): any;

  /**
   * Fired when frame schedules a potential navigation.
   *
   * EXPERIMENTAL
   */
  frameScheduledNavigation(
    callback: (frameId: FrameId, delay: number) => any
  ): any;

  /**
   * Fired when frame no longer has a scheduled navigation.
   *
   * EXPERIMENTAL
   */
  frameClearedScheduledNavigation(callback: (frameId: FrameId) => any): any;

  /**
   * EXPERIMENTAL
   */
  frameResized(callback: Function): any;

  /**
   * Fired when a JavaScript initiated dialog
   * (alert, confirm, prompt, or onbeforeunload) is about to open.
   */
  javascriptDialogOpening(
    callback: (result: boolean, type: DialogType) => any
  ): any;

  /**
   * Fired when a JavaScript initiated dialog
   * (alert, confirm, prompt, or onbeforeunload) has been closed.
   */
  javascriptDialogClosed(callback: (result: boolean) => any): any;

  /**
   * Compressed image data requested by the startScreencast.
   *
   * EXPERIMENTAL
   */
  screencastFrame(
    callback: (
      data: string,
      metadata: ScreencastFrameMetadata,
      sessionId: number
    ) => any
  ): any;

  /**
   * Fired when the page with currently enabled screencast was shown or hidden .
   *
   * EXPERIMENTAL
   */
  screencastVisibilityChanged(callback: (visible: boolean) => any): any;

  /**
   * Fired when interstitial page was shown
   */
  interstitialShown(callback: Function): any;

  /**
   * Fired when interstitial page was hidden
   */
  interstitialHidden(callback: Function): any;

  /**
   * Fired when a navigation is started if navigation throttles are enabled.
   * The navigation will be deferred until processNavigation is called.
   */
  navigationRequested(
    callback: (
      isInMainFrame: boolean,
      isRedirect: boolean,
      navigationId: number,
      url: string
    ) => any
  ): any;
};
