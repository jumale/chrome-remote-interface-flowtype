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
