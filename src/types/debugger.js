// @flow
// from: https://chromedevtools.github.io/devtools-protocol/tot/Debugger/

import type {
  ScriptId,
  RemoteObject,
  StackTrace,
  ExceptionDetails,
  CallArgument,
  ExecutionContextId
} from './runtime';

/**
 * BreakpointId
 */
export type BreakpointId = string;

/**
 * Call frame identifier.
 */
export type CallFrameId = string;

/**
 * Location in the source code.
 */
export type Location = {
  scriptId: ScriptId,
  linenumber: number,
  columnnumber?: number,
};

/**
 * Location in the source code.
 *
 * EXPERIMENTAL
 */
export type ScriptPosition = {
  linenumber: number,
  columnnumber: number,
};

/**
 * Scope type.
 * Allowed values: global, local, with, closure, catch, block, script, eval, module.
 */
export type ScopeType = "global" | "local" | "with" | "closure" | "catch" |
                        "block" | "script" | "eval" | "module";


/**
 * Scope description.
 */
export type Scope = {
  type: ScopeType,
  object: RemoteObject,
  name?: string,
  startLocation?: Location,
  endLoation?: Location,
};

/**
 * JavaScript call frame. Array of call frames form the call stack.
 */
export type CallFrame = {
  callFrameId: CallFrameId,
  functionName: string,
  functionLocation?: Location,
  location: Location,
  scopeChain: Array<Scope>,
  this: RemoteObject,
  returnValue?: RemoteObject,
};

/**
 * Search match for resource.
 *
 * EXPERIMENTAL
 */
export type SearchMatch = {
  linenumber: number,
  lineContent: string,
};

/**
 * EXPERIMENTAL
 */
export type BreakLocation = {
  scriptId: ScriptId,
  lineNumber: number,
  columnnumber?: number,
  type?: "debuggerStatement" | "call" | "return",
};

/**
 * @type {Object}
 */
export type Debugger = {
  /**
   * Enables debugger for the given page.
   * Clients should not assume that the debugging has been enabled
   * until the result for this command is received.
   */
  enable(): Promise<>;

  /**
   * Disables debugger for given page.
   */
  disable(): Promise<>;

  /**
   * Activates / deactivates all breakpoints on the page.
   */
  setBreakpointsActive(arg: { active: boolean }): Promise<>;

  /**
   * Makes page not interrupt on any pauses (breakpoint, exception, dom exception etc).
   */
  setSkipAllPauses(arg: { skip: boolean }): Promise<>;

  /**
   * Sets JavaScript breakpoint at given location specified either by URL or URL regex.
   * Once this command is issued,
   * all existing parsed scripts will have breakpoints
   * resolved and returned in locations property.
   * Further matching script parsing will result in subsequent breakpointResolved events issued.
   * This logical breakpoint will survive page reloads.
   */
  setBreakpointByUrl(arg: {
    lineNumber: number,
    url?: string,
    urlRegex?: string,
    columnNumber: number,
    condition?: string
  }): Promise<{
    breakpointId: BreakpointId,
    locations: Array<Location>,
  }>;

  /**
   * Sets JavaScript breakpoint at a given location.
   */
  setBreakPoint(arg: { location: Location, condition?: string }): Promise<{
    breakpointId: BreakpointId,
    actualLocation: Location
  }>;

  /**
   * Removes JavaScript breakpoint.
   */
  removeBreakpoint(arg: { breakpointId: BreakpointId }): Promise<>;

  /**
   * Returns possible locations for breakpoint.
   * scriptId in start and end range locations should be the same.
   *
   * EXPERIMENTAL
   */
  getPossibleBreakpoints(arg?: {
    start: Location,
    end?: Location,
    restrictToFunction?: boolean
  }): Promise<{
    locations: Array<BreakLocation>,
  }>;

  /**
   * Continues execution until specific location is reached.
   */
  continueToLocation(arg: {
    location: Location,
    targetCallFrames?: "any" | "current"
  }): Promise<>;

  /**
   * Steps over the statement.
   */
  stepOver(): Promise<>;

  /**
   * Steps into the function call.
   */
  stepInto(): Promise<>;

  /**
   * Steps out of the function call.
   */
  stepOut(): Promise<>;

  /**
   * Stops on the next JavaScript statement.
   */
  pause(): Promise<>;

  /**
   * Steps into next scheduled async task if any is scheduled before next pause.
   * Returns success when async task is actually scheduled,
   * returns error if no task were scheduled or another scheduleStepIntoAsync was called.
   *
   * EXPERIMENTAL
   */
  scheduleStepIntoAsync(): Promise<>;

  /**
   * Resumes JavaScript execution.
   */
  resume(): Promise<>;

  /**
   * Searches for given string in script content.
   *
   * EXPERIMENTAL
   */
  searchInContent(arg: {
    scriptId: ScriptId,
    query: string,
    caseSensitive?: boolean,
    isRegex?: boolean
  }): Promise<{ result: Array<SearchMatch> }>;

  /**
   * Edits JavaScript source live.
   */
  setScriptSource(arg: {
    scriptId: ScriptId,
    scriptSource: string,
    dryRun?: boolean,
  }): Promise<{
    callFrames?: Array<CallFrame>,
    stackChanged?: boolean,
    asyncStackTrace?: StackTrace,
    exceptionDetails?: ExceptionDetails,
  }>;

  /**
   * Restarts particular call frame from the beginning.
   */
  restartFrame(arg: { callFrameId: CallFrameId }): Promise<{
    callFrames: Array<CallFrame>,
    asyncStackTrace?: StackTrace,
  }>;

  /**
   * Returns source for the script with given id.
   */
  getScriptSource(arg: { scriptId: ScriptId }): Promise<{
    scriptSource: string,
  }>;

  /**
   * Defines pause on exceptions state.
   * Can be set to stop on all exceptions,
   * uncaught exceptions or no exceptions.
   * Initial pause on exceptions state is none.
   */
  setPauseOnExceptions(arg: { state: "none" | "uncaught" | "all"}): Promise<>;

  /**
   * Evaluates expression on a given call frame.
   */
  evaluateOnCallFrame(arg: {
    callFrameId: CallFrameId,
    expression: string,
    objectGroup?: Object,
    includeCommandLineAPI?: boolean,
    silent?: boolean,
    returnByValue?: boolean,
    generatePreview?: boolean,
    throwOnSideEffect?: boolean,
  }): Promise<{
    result: RemoteObject,
    exceptionDetails?: ExceptionDetails,
  }>;

  /**
   * Changes value of variable in a callframe.
   * Object-based scopes are not supported and must be mutated manually.
   */
  setVariableValue(arg: {
    scopeNumber: number,
    variableName: string,
    newValue: CallArgument,
    callFrameId: CallFrameId,
  }): Promise<>;

  /**
   * Enables or disables async call stacks tracking.
   */
  setAsyncCallStackDepth(arg: { maxDepth: number }): Promise<>;

  /**
   * Replace previous blackbox patterns with passed ones.
   * Forces backend to skip stepping/pausing in scripts with url matching one of the patterns.
   * VM will try to leave blackboxed script by performing 'step in' several times,
   * finally resorting to 'step out' if unsuccessful.
   *
   * EXPERIMENTAL
   */
  setBlackboxPatterns(arg: { patterns: Array<string> }): Promise<>;

  /**
   * Makes backend skip steps in the script in blackboxed ranges.
   * VM will try leave blacklisted scripts by performing 'step in' several times,
   * finally resorting to 'step out' if unsuccessful.
   * Positions array contains positions where blackbox state is changed.
   * First interval isn't blackboxed. Array should be sorted.
   *
   * EXPERIMENTAL
   */
  setBlackboxedRanges(arg: {
    scriptId: ScriptId, positions: Array<ScriptPosition>
  }): Promise<>;

  /** events **/

  /**
   * Fired when virtual machine parses script.
   * This event is also fired for all known and uncollected scripts upon enabling debugger.
   */
  scriptParsed(callback: (
    scriptId: ScriptId,
    url: string,
    startLine: number,
    startColumn: number,
    endLine: number,
    endColumn: number,
    executionContextId: ExecutionContextId,
    hash: string,
    executionContextAuxData?: Object,
    isLiveEdit?: boolean,
    sourceMapURL?: string,
    hasSourceURL?: string,
    isModule?: boolean,
    length?: number,
    stackTrace?: StackTrace
  ) => void): Promise<>;

  /**
   * Fired when virtual machine fails to parse the script.
   */
  scriptFailedToParse(callback: (
    scriptId: ScriptId,
    url: string,
    startLine: number,
    startColumn: number,
    endLine: number,
    endColumn: number,
    executionContextId: ExecutionContextId,
    hash: string,
    executionContextAuxData?: Object,
    isLiveEdit?: boolean,
    sourceMapURL?: string,
    hasSourceURL?: string,
    isModule?: boolean,
    length?: number,
    stackTrace?: StackTrace
  ) => void): Promise<>;

  /**
   * Fired when breakpoint is resolved to an actual script and location.
   */
  breakpointResolved(callback: (
    breakpointId: BreakpointId,
    location: Location
  ) => void): Promise<>;

  /**
   * Fired when the virtual machine stopped on breakpoint or exception or any other stop criteria.
   */
  paused(callback: (
    callFrames: Array<CallFrame>,
    reason:  "XHR" | "DOM" | "EventListener" | "exception" | "assert" |
             "debugCommand" | "promiseRejection" | "OOM" | "other" | "ambiguous",
    data: Object,
    hitBreakpoints?: Array<string>,
    asyncStackTrace?: StackTrace
  ) => void): Promise<>;

  /**
   * Fired when the virtual machine resumed execution.
   */
  resumed(): Promise<>;
};
