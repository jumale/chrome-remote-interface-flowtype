// @flow
// from: https://chromedevtools.github.io/devtools-protocol/tot/Input/

/**
 * Type of the key event. Allowed values: keyDown, keyUp, rawKeyDown, char.
 */
export type KeyTypes = "keyDown" | "keyUp" | "rawKeyDown" | "char";

/**
 * Type of the mouse event. Allowed values: mousePressed, mouseReleased, mouseMoved.
 */
export type MouseTypes = "mousePressed" | "mouseReleased" | "mouseMoved" | "mouseWheel";

/**
 * Mouse button (default: "none"). Allowed values: none, left, middle, right.
 */
export type ButtonTypes = "none" | "left" | "middle" | "right";


/**
 * Dispatches a touch event to the page.
 */
export type TouchTypes = "touchStart" | "touchEnd" | "touchMove";

/**
 * State of the touch point.
 * Allowed values: touchPressed, touchReleased, touchMoved, touchStationary, touchCancelled.
 */
export type TouchStateTypes = "touchPressed" | "touchReleased" | "touchMoved" | "touchStationary" | "touchCancelled";

/**
 * Which type of input events to be generated
 * (default: 'default', which queries the platform for the preferred input type).
 */
export type GestureSourceType = "default" | "touch" | "mouse";

/**
 * EXPERIMENTAL
 */
export type TouchPoint = {
  state: TouchStateTypes,
  x: number,
  y: number,
  radiusX?: number,
  radiusY?: number,
  rotationAngle?: number,
  force?: number,
  id?: number,
};

/**
 * UTC time in seconds, counted from January 1, 1970.
 */
export type TimeSinceEpoch = number;

/**
 * @type {Object}
 */
export type Input = {
  /**
   * Ignores input events (useful while auditing page).
   */
  setIgnoreInputEvents(arg: { ignore: boolean }): Promise<>;

  /**
   * Dispatches a key event to the page.
   */
  dispatchKeyEvent(arg: {
    type: KeyTypes,
    modifiers?: number,
    timestamp?: TimeSinceEpoch,
    text?: string,
    unmodifiedText?: string,
    keyIdentifier?: string,
    code?: string,
    key?: string,
    windowsVirtualKeyCode?: number,
    nativeVirtualKeyCode?: number,
    autoRepeat?: boolean,
    isKeypad?: boolean,
    isSystemKey?: boolean
  }): Promise<>;

  /**
   * Dispatches a mouse event to the page.
   */
  dispatchMouseEvent(arg: {
    type: MouseTypes,
    x: number,
    y: number,
    modifiers?: number,
    timestamp?: TimeSinceEpoch,
    button?: ButtonTypes,
    clickCount?: number
  }): Promise<>;

  /**
   * Dispatches a touch event to the page.
   *
   * EXPERIMENTAL
   */
  dispatchTouchEvent(arg: {
    type: TouchTypes,
    touchPoints: Array<TouchPoint>,
    modifiers?: number,
    timestamp?: TimeSinceEpoch
  }): Promise<>;

  /**
   * Emulates touch event from the mouse event parameters.
   *
   * EXPERIMENTAL
   */
  emulateTouchFromMouseEvent(arg: {
    type: MouseTypes,
    x: number,
    y: number,
    timestamp: TimeSinceEpoch,
    button: ButtonTypes,
    deltaX?: number,
    deltaY?: number,
    modifiers?: number,
    clickCount?: number
  }): Promise<>;

  /**
   * Synthesizes a pinch gesture over a time period by issuing appropriate touch events.
   *
   * EXPERIMENTAL
   */
  synthesizePinchGesture(arg: {
    x: number,
    y: number,
    scaleFactor: number,
    relativeSpeed?: number,
    gestureSourceType?: GestureSourceType
  }): Promise<>;

  /**
   * Synthesizes a scroll gesture over a time period by issuing appropriate touch events.
   *
   * EXPERIMENTAL
   */
  synthesizeScrollGesture(arg: {
    x: number,
    y: number,
    xDistance?: number,
    yDistance?: number,
    xOverscroll?: number,
    yOverscroll?: number,
    preventFling?: boolean,
    speed?: number,
    gestureSourceType?: GestureSourceType,
    repeatCount?: number,
    repeatDelayMs?: number,
    interactionMarkerName?: string
  }): Promise<>;

  /**
   * Synthesizes a tap gesture over a time period by issuing appropriate touch events.
   *
   * EXPERIMENTAL
   */
  synthesizeTapGesture(arg: {
    x: number,
    y: number,
    duration?: number,
    tapCount?: number,
    gestureSourceType?: GestureSourceType
  }): Promise<>;
};
