/**
 * Enum for status code
 * @enum {string} StatusCode - Enum for status code of HTTP response
 * @property {string} Success - 200
 * @property {string} notFound - 404
 * @property {string} BadRequest - 400
 * @property {string} Conflict - 409
 * @property {string} NotRange - 412
 * @example StatusCode.Success or StatusCode.notFound
 */
export enum StatusCode {
  Success = "200",
  notFound = "404",
  BadRequest = "400",
  Conflict = "409",
  NotRange = "412",
}
