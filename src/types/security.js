// @flow

/**
 * An internal certificate ID value.
 */
export type CertificateId = number;

/**
 * A description of mixed content (HTTP resources on HTTPS pages), as defined by
 * https://www.w3.org/TR/mixed-content/#categories
 */
export type MixiedContentType = "blockable" | "optionally-blockable" | "none";

/**
 * The security level of a page or resource.
 */
export type SecurityState = "unknown" | "neutral" | "insecure" | "warning" | "secure" | "info";

/**
 * An explanation of an factor contributing to the security state.
 */
export type SecurityStateExplanation = {
  securityState: SecurityState,
  summary: string,
  description: string,
  hasCertificate: boolean,
  mixedContentType: MixiedContentType,
};

/**
 * Information about insecure content on the page.
 */
export type InsecureContentStatus = {
  ranMixedContent: boolean,
  displayedMixedContent: boolean,
  containedMixedForm: boolean,
  ranContentWithCertErrors: boolean,
  displayedContentWithCertErrors: boolean,
  ranInsecureContentStyle: SecurityState,
  displayedInsecureContentStyle: SecurityState,
};

/**
 * The action to take when a certificate error occurs.
 * continue will continue processing the request and cancel will cancel the request.
 */
export type CertificateErrorAction = "continue" | "cancel";


/**
 * Security Domain
 *
 * EXPERIMENTAL
 */
export type Security = {
  /**
   * Enables tracking security state changes.
   */
  enable(): Promise<>;

  /**
   * Disables tracking security state changes.
   */
  disable(): Promise<>;

  /**
   * Displays native dialog with the certificate details.
   */
  showCertificateViewer(): Promise<>;

  /**
   * Handles a certificate error that fired a certificateError event.
   */
  handleCertificateError(arg: {
    eventId: number,
    action: CertificateErrorAction
  }): Promise<>;

  /**
   * Enable/disable overriding certificate errors. If enabled,
   * all certificate error events need to be handled by
   * the DevTools client and should be answered with handleCertificateError commands.
   */
  setOverrideCertificateErrors(arg: {
    override: boolean
  }): Promise<>;

  /* events */

  /**
   * The security state of the page changed.
   */
  securityStateChanged(callback: (
    securityState: SecurityState,
    schemeIsCryptographic: boolean,
    explanations: Array<SecurityStateExplanation>,
    insecureContentStatus: InsecureContentStatus,
    summary?: string
  ) => any): any;

  /**
   * There is a certificate error.
   * If overriding certificate errors is enabled,
   * then it should be handled with the handleCertificateError command.
   *
   * Note: this event does not fire if the certificate error has been allowed internally.
   */
  certificateError(callback: (
    eventId: number,
    errorType: string,
    requestURL: string
  ) => any): any;
};
