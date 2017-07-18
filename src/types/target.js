// @flow
// from: https://chromedevtools.github.io/devtools-protocol/tot/Target/

/**
 */
export type TargetID = string;

/**
 */
export type BrowserContextID = string;

/**
 */
export type RemoteLocation = {
  host: string,
  port: number,
};

/**
 */
export type TargetInfo = {
  targetId: TargetID,
  type: string,
  title: string,
  url: string,
  attached: boolean,
};

/**
 * Target Domain
 * Supports additional targets discovery and allows to attach to them.
 */
export type Target = {
  /**
   * Controls whether to discover available targets and
   * notify via targetCreated/targetDestroyed events.
   */
  setDiscoverTargets(arg: { discover: boolean }): Promise<>;

  /**
   * Controls whether to automatically attach to
   * new targets which are considered to be related to this one.
   * When turned on, attaches to all existing related targets as well.
   * When turned off, automatically detaches from all currently attached targets.
   */
  setAutoAttach(arg: {
    authAttach: boolean,
    waitForDebuggerOnStart: boolean
  }): Promise<>;

  /**
   */
  setAttachToFrames(arg: { value: boolean }): Promise<>;

  /**
   * Enables target discovery for the specified locations, when setDiscoverTargets was set to true.
   */
  setRemoteLocations(arg: { locations: Array<RemoteLocation> }): Promise<>;

  /**
   * Sends protocol message to the target with given id.
   */
  sendMessageToTarget(arg: { targetId: TargetID, message: string }): Promise<>;

  /**
   * Returns information about a target.
   */
  getTargetInfo(arg: { targetId: TargetID }): Promise<{ targetInfo: TargetInfo }>;

  /**
   * Activates (focuses) the target.
   */
  activateTarget(arg: { targetId: TargetID }): Promise<>;

  /**
   * Closes the target. If the target is a page that gets closed too.
   */
  closeTarget(arg: { targetId: TargetID }): Promise<{ success: boolean }>;

  /**
   * Attaches to the target with given id.
   */
  attachToTarget(arg: { targetId: TargetID }): Promise<{ success: boolean }>;

  /**
   * Detaches from the target with given id.
   */
  detachFromTarget(arg: { targetId: TargetID }): Promise<>;

  /**
   * Creates a new empty BrowserContext.
   * Similar to an incognito profile but you can have more than one.
   */
  createBrowserContext(): Promise<{ browserContextId: BrowserContextID }>;

  /**
   * Deletes a BrowserContext, will fail of any open page uses it.
   */
  disposeBrowserContext(arg: {
    browserContextId: BrowserContextID
  }): Promise<{ success: boolean }>;

  /**
   * Creates a new page.
   */
  createTarget(arg: {
    url: string,
    width?: number,
    height?: number,
    browserContextId?: BrowserContextID
  }): Promise<{ targetId: TargetID }>;

  /**
   * Retrieves a list of available targets.
   */
  getTargets(): Promise<{ targetInfos: Array<TargetInfo> }>;

  /* events */

  /**
   * Issued when a possible inspection target is created.
   */
  targetCreated(callback: (targetInfo: TargetInfo) => void): void;

  /**
   * Issued when some information about a target has changed.
   * This only happens between targetCreated and targetDestroyed.
   */
  targetInfoChanged(callback: (targetInfo: TargetInfo) => void): void;

  /**
   * Issued when a target is destroyed.
   */
  targetDestroyed(callback: (targetId: TargetID) => void): void;

  /**
   * Issued when attached to target because of auto-attach or attachToTarget command.
   */
  attachedToTarget(callback: (
    targetInfo: TargetInfo, waitingForDebugger: boolean
  ) => void): void;

  /**
   * Issued when detached from target for any reason (including detachFromTarget command).
   */
  detachedFromTarget(callback: (targetId: TargetID) => void): void;

  /**
   * Notifies about new protocol message from attached target.
   */
  receivedMessageFromTarget(callback: (
    targetId: TargetID, message: string
  ) => void): void;
};
