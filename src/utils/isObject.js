/**
 * @param {*} value
 * @descriptiion Checks if given arguemt is an object.
 * @returns bool
 */
export default function isObject(value) {
  return typeof value === "object" && value !== null;
}
