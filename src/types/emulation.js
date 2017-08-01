// @flow
// from: https://chromedevtools.github.io/devtools-protocol/tot/Emulation/

import type { RGBA } from './dom';

/**
 * Screen orientation.
 */
export type ScreenOrientation = {
  type: "portraitPrimary" | "portraitSecondary" | "landscapePrimary" | "landscapeSecondary",
  angle: number,
};

/**
 * advance: If the scheduler runs out of immediate work,
 * the virtual time base may fast forward to allow the next delayed task (if any) to run;
 * pause: The virtual time base may not advance;
 * pauseIfNetworkFetchesPending: The virtual time base may not advance
 * if there are any pending resource fetches.
 *
 * EXPERIMENTAL
 */
export type VirtualTimePolicy = "advance" | "pause" | "pauseIfNetworkFetchesPending";

/**
 * Emultation Domain
 */
export type Emulation = {
  /**
   * Overrides the values of device screen dimensions
   * (window.screen.width, window.screen.height, window.innerWidth, window.innerHeight,
   * and "device-width"/"device-height"-related CSS media query results).
   */
  setDeviceMetricsOverride(arg: {
    width: number,
    height: number,
    deviceScaleFactor: number,
    mobile: boolean,
    fitWindow?: boolean,
    scale?: number,
    offsetX?: number,
    offsetY?: number,
    screenWidth?: number,
    screenHeight?: number,
    positionX?: number,
    positionY?: number,
    screenOrientation?: ScreenOrientation
  }): Promise<>;

  /**
   * Clears the overriden device metrics.
   */
  clearDeviceMetricsOverride(): Promise<>;

  /**
   * Requests that page scale factor is reset to initial values.
   *
   * EXPERIMENTAL
   */
  resetPageScaleFactor(): Promise<>;

  /**
   * Sets a specified page scale factor.
   *
   * EXPERIMENTAL
   */
  setPageScaleFactor(arg: { pageScaleFactor: number }): Promise<>;

  /**
   * Resizes the frame/viewport of the page.
   * Note that this does not affect the frame's container (e.g. browser window).
   * Can be used to produce screenshots of the specified size. Not supported on Android.
   *
   * EXPERIMENTAL
   * DEPRECATED
   */
  setVisibleSize(arg: { width: number, height: number }): Promise<>;

  /**
   * Switches script execution in the page.
   *
   * EXPERIMENTAL
   */
  setScriptExecutionDisabled(arg: { value: boolean }): Promise<>;

  /**
   * Overrides the Geolocation Position or Error.
   * Omitting any of the parameters emulates position unavailable.
   *
   * EXPERIMENTAL
   */
  setGeolocationOverride(arg: {
    latitude?: number,
    longitude?: number,
    accuracy?: number
  }): Promise<>;

  /**
   * Clears the overriden Geolocation Position and Error.
   *
   * EXPERIMENTAL
   */
  clearGeolocationOverride(): Promise<>;

  /**
   * Toggles mouse event-based touch event emulation.
   */
  setTouchEmulationEnabled(arg: {
    enabled: boolean,
    configuration?: "mobile" | "desktop"
  }): Promise<>;

  /**
   * Emulates the given media for CSS media queries.
   */
  setEmulatedMedia(arg: { media: string }): Promise<>;

  /**
   * Enables CPU throttling to emulate slow CPUs.
   *
   * EXPERIMENTAL
   */
  setCPUThrottlingRate(arg: { rate: number }): Promise<>;

  /**
   * Tells whether emulation is supported.
   *
   * EXPERIMENTAL
   */
  canEmulate(arg: { result: boolean }): Promise<>;

  /**
   * Turns on virtual time for all frames (replacing real-time with a synthetic time source)
   * and sets the current virtual time policy. Note this supersedes any previous time budget.
   *
   * EXPERIMENTAL
   */
  setVirtualTimePolicy(arg: {
    policy: VirtualTimePolicy,
    budget?: number
  }): Promise<>;

  /**
   * Sets or clears an override of the default background color of the frame.
   * This override is used if the content does not specify one.
   */
  setDefaultBackgroundColorOverride(arg: { color?: RGBA }): Promise<>;

  /* events */

  /**
   * Notification sent after the virual time budget for the current VirtualTimePolicy has run out.
   */
  virtualTimeBudgetExpired(callback: Function): any;
};
