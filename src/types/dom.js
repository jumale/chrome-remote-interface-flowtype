// @flow
// from: https://chromedevtools.github.io/devtools-protocol/tot/DOM/

import type { FrameId } from './page';
import type { RemoteObjectId, RemoteObject } from './runtime';

/**
 * Unique DOM node identifier.
 */
export type NodeId = number;

/**
 * Unique DOM node identifier used to reference a node
 * that may not have been pushed to the front-end
 *
 * EXPERIMENTAL
 */
export type BackendNodeId = number;

/**
 * Backend node with a friendly name.
 *
 * EXPERIMENTAL
 */
export type BackendNode = {
  nodeType: number,
  nodeName: string,
  backendNodeId: BackendNodeId,
};

/**
 * Pseudo element type.
 */
export type PseudoType = "first-line" | "first-letter" | "before" |
                         "after" | "backdrop" | "selection" | "first-line-inherited" |
                         "scrollbar" | "scrollbar-thumb" | "scrollbar-button" |
                         "scrollbar-track" | "scrollbar-track-piece" | "scrollbar-corner" |
                         "resizer" | "input-list-button";

/**
 * Shadow root type.
 */
export type ShadowRootType = "user-agent" | "open" | "closed";

/**
 * DOM interaction is implemented in terms of mirror objects that represent the actual DOM nodes.
 * DOMNode is a base node mirror type.
 */
export type Node = {
  nodeId: NodeId,
  parentId?: NodeId,
  backendNodeId: BackendNodeId,
  nodeType: number,
  nodeName: string,
  localName: string,
  nodeValue: string,
  childNodeCount?: number,
  children?: Array<Node>,
  attributes?: Array<string>,
  documentURL?: string,
  baseURL?: string,
  publicId?: string,
  systemId?: string,
  internalSubset?: string,
  xmlVersion?: string,
  name?: string,
  value?: string,
  pseudoType?: PseudoType,
  shadowRootType?: ShadowRootType,
  frameId?: FrameId,
  contentDocument?: Node,
  shadowRoots?: Array<Node>,
  templateContent?: Node,
  pseudoElements?: Array<Node>,
  importedDocument?: Node,
  distributedNodes?: Array<BackendNode>,
  isSVG?: boolean,
};

/**
 * A structure holding an RGBA color.
 */
export type RGBA = {
  r: number,
  g: number,
  b: number,
  a?: number,
};

/**
 * An array of quad vertices, x immediately followed by y for each point, points clock-wise.
 *
 * EXPERIMENTAL
 */
export type Quad = Array<any>;

/**
 * Rectangle
 *
 * EXPERIMENTAL
 */
export type Rect = {
  x: number,
  y: number,
  width: number,
  height: number
};

/**
 * CSS Shape Outside details
 *
 * EXPERIMENTAL
 */
export type ShapeOutsideInfo = {
  bouds: Quad,
  shape: Array<mixed>,
  marginShape: Array<mixed>,
};

/**
 * Box model
 */
export type BoxModel = {
  content: Quad,
  padding: Quad,
  border: Quad,
  margin: Quad,
  width: Quad,
  height: Quad,
  shapeOutside: ShapeOutsideInfo,
};

/**
 * DOM events and methods
 */
export type DOM = {
  /**
   * Enables DOM agent for the given page.
   */
  enable(): Promise<>;

  /**
   * Disables DOM agent for the given page.
   */
  disable(): Promise<>;

  /**
   * Returns the root DOM node (and optionally the subtree) to the caller.
   */
  getDocument(arg?: {depth?: number, pierce?: boolean}): Promise<{root: Node}>;

  /**
   * Returns the root DOM node (and optionally the subtree) to the caller.
   */
  getFlattenedDocument(arg?: {death?: number, pierce?: boolean}): Promise<{nodes: Array<Node>}>;

  /**
   * Collects class names for the node with given id and all of it's child nodes.
   */
  collectClassNamesFromSubtree(arg: {nodeId: NodeId}): Promise<{classNames: Array<string>}>;

  /**
   * Requests that children of the node with
   * given id are returned to the caller in form of setChildNodes events
   * where not only immediate children are retrieved, but all children down to the specified depth.
   */
  requestChildNodes(arg: {nodeId: NodeId, depth?: number, pierce?: boolean}): Promise<>;

  /**
   * Executes querySelector on a given node.
   */
  querySelector(arg: {
    nodeId: NodeId,
    selector: string
  }): Promise<{nodeId: NodeId}>;

  /**
   * Executes querySelectorAll on a given node.
   */
  querySelectorAll(arg: {
    nodeId: NodeId,
    selector: string
  }): Promise<{nodeIds: Array<NodeId>}>;

  /**
   * Sets node name for a node with given id.
   */
  setNodeName(arg: {nodeId: NodeId, name: string}): Promise<{nodeId: NodeId}>;

  /**
   * Sets node value for a node with given id.
   */
  setNodeValue(arg: {nodeId: NodeId, name: string}): Promise<>;

  /**
   * Removes node with given id.
   */
  removeNode(arg: {nodeId: NodeId}): Promise<>;

  /**
   * Sets attribute for an element with given id.
   */
  setAttributeValue(arg: {nodeId: NodeId, name: string, value: string}): Promise<>;

  /**
   * Sets attributes on element with given id.
   * This method is useful when user edits some existing
   * attribute value and types in several attribute name/value pairs.
   */
  setAttributesAsText(arg: {nodeId: NodeId, text: string, name?: string}): Promise<>;

  /**
   * Removes attribute with given name from an element with given id.
   */
  removeAttribute(arg: {nodeId: NodeId, name: string}): Promise<>;

  /**
   * Returns node's HTML markup.
   */
  getOuterHTML(arg: {nodeId: NodeId}): Promise<{outerHTML: string}>;

  /**
   * Sets node HTML markup, returns new node id.
   */
  setOuterHTML(arg: {nodeId: NodeId, outerHTML: string}): Promise<>;

  /**
   * Searches for a given string in the DOM tree.
   * Use getSearchResults to access search results or cancelSearch to end this search session.
   *
   * EXPERIMENTAL
   */
  performSearch(arg: {
    query: string, includeUserAgentShadowDOM?: boolean
  }): Promise<{searchId: string, resultCount: number}>;

  /**
   * Returns search results
   * from given fromIndex to given toIndex from the sarch with the given identifier.
   *
   * EXPERIMENTAL
   */
  getSearchResults(arg: {
    searchId: string,
    fromIndex: number,
    toIndex: number
  }): Promise<{nodeIds: Array<NodeId>}>;

  /**
   * Discards search results from the session with the given id.
   * getSearchResults should no longer be called for that search
   *
   * EXPERIMENTAL
   */
  discardSearchResults(arg: {searchId: string}): Promise<>;

  /**
   * Requests that the node is sent to the caller given the JavaScript node object reference.
   * All nodes that form the path from the node to the root are also sent to
   * the client as a series of setChildNodes notifications.
   */
  requestNode(arg: {objectId: RemoteObjectId}): Promise<{nodeId: NodeId}>;

  /**
   * Requests that the node is sent to the caller given its path.
   *
   * EXPERIMENTAL
   */
  pushNodeByPathToFrontend(arg: {path: string}): Promise<{nodeId: NodeId}>;

  /**
   * Requests that a batch of nodes is sent to the caller given their backend node ids.
   *
   * EXPERIMENTAL
   */
  pushNodesByBackendIdsToFrontend(arg: {
    backendNodeIds: Array<BackendNodeId>
  }): Promise<{nodeIds: Array<NodeId>}>;

  /**
   * Enables console to refer to the node with given id via
   * $x (see Command Line API for more details $x functions).
   *
   * EXPERIMENTAL
   */
  setInspectedNode(arg: {nodeId: NodeId}): Promise<>;

  /**
   * Resolves JavaScript node object for given node id.
   */
  resolveNode(arg: {nodeId: NodeId, objectGroup?: string}): Promise<{object: RemoteObject}>;

  /**
   * Returns attributes for the specified node.
   */
  getAttributes(arg: {nodeId: NodeId}): Promise<{attributes: Array<string>}>;

  /**
   * Creates a deep copy of the specified node and places
   * it into the target container before the given anchor.
   *
   * EXPERIMENTAL
   */
  copyTo(arg: {
    nodeId: NodeId, targetNodeId: NodeId, insertBeforeNodeId?: NodeId
  }): Promise<{nodeId: NodeId}>;

 /**
  * Moves node into the new container, places it before the given anchor.
  */
  moveTo(arg: {
   nodeId: NodeId, targetNodeId: NodeId, insertBeforeNodeId?: NodeId
 }): Promise<{nodeId: NodeId}>;

  /**
   * Undoes the last performed action.
   *
   * EXPERIMENTAL
   */
  undo() : Promise<>;

  /**
   * Re-does the last undone action.
   *
   * EXPERIMENTAL
   */
  redo(): Promise<>;

  /**
   * Marks last undoable state.
   *
   * EXPERIMENTAL
   */
  markUndoableState(): Promise<>;

  /**
   * Focuses the given element.
   *
   * EXPERIMENTAL
   */
  focus(arg: {nodeId: NodeId}): Promise<>;

  /**
   * Sets files for the given file input element.
   *
   * EXPERIMENTAL
   */
  setFileInputFiles(arg: {nodeId: NodeId, files: Array<string>}): Promise<>;

  /**
   * Returns boxes for the currently selected nodes.
   *
   * EXPERIMENTAL
   */
  getBoxModel(arg: {nodeId: NodeId}): Promise<{model: BoxModel}>;

  /**
   * Returns node id at given location.
   *
   * EXPERIMENTAL
   */
  getNodeForLocation(arg: {
    x: number,
    y: number,
    includeUserAgentShadowDOM?: boolean
  }): Promise<{nodeId: NodeId}>;

  /**
   * Returns the id of the nearest ancestor that is a relayout boundary.
   *
   * EXPERIMENTAL
   */
  getRelayoutBoundary(arg: {nodeId: NodeId}): Promise<{nodeId: NodeId}>;

  /* events */

  /**
   * Fired when Document has been totally updated. Node ids are no longer valid.
   */
  documentUpdated(callback: Function): void;

  /**
   * Fired when backend wants to provide client with the missing DOM structure.
   * This happens upon most of the calls requesting node ids.
   */
  setChildNodes(callback: (parentId: NodeId, nodes: Array<Node>) => void): void;


  /**
   * Fired when Element's attribute is modified.
   */
  attributeModified(callback: (
    nodeId: NodeId, name: string, value: string
  ) => void): void;

  /**
   * Fired when Element's attribute is removed.
   */
  attributeRemoved(callback: (
    nodeId: NodeId, name: string
  ) => void): void;

  /**
   * Fired when Element's inline style is modified via a CSS property modification.
   *
   * EXPERIMENTAL
   */
  inlineStyleInvalidated(callback: (
    nodeIds: Array<NodeId>
  ) => void): void;

  /**
   * Mirrors DOMCharacterDataModified event.
   */
  characterDataModified(callback: (
    nodeId: NodeId, characterData: string
  ) => void): void;

  /**
   * Fired when Container's child node count has changed.
   */
  childNodeCountUpdated(callback: (
    nodeId: NodeId, childNodeCount: number
  ) => void): void;

  /**
   * Mirrors DOMNodeInserted event.
   */
  childNodeInserted(callback: (
    parentNodeId: NodeId,
    previousNodeId: NodeId,
    node: Node
  ) => void): void;

  /**
   * Mirrors DOMNodeRemoved event.
   */
  childNodeRemoved(callback: (parentNodeId: NodeId, nodeId: NodeId) => void): void;

  /**
   * Called when shadow root is pushed into the element.
   *
   * EXPERIMENTAL
   */
  shadowRootPushed(callback: (hostId: NodeId, root: Node) => void): void;

  /**
   * Called when shadow root is popped from the element.
   *
   * EXPERIMENTAL
   */
  shadowRootPopped(callback: (hostId: NodeId, root: Node) => void): void;

  /**
   * Called when a pseudo element is added to an element.
   *
   * EXPERIMENTAL
   */
  pseudoElementAdded(callback: (parentNodeId: NodeId, pseudoElement: Node) => void): void;

  /**
   * Called when a pseudo element is removed from an element.
   *
   * EXPERIMENTAL
   */
  pseudoElementRemoved(callback: (parentNodeId: NodeId, pseudoElement: Node) => void): void;

  /**
   * Called when distrubution is changed.
   *
   * EXPERIMENTAL
   */
  distributedNodesUpdated(callback: (
    insertionPointId: NodeId, distributedNodes: Array<Node>
  ) => void): void;
};
