/**
 * Removes the first slash from a given path.
 *
 * @param path - The path to remove the first slash from.
 * @returns The path without the first slash.
 */
export const dropFirstSlash = (path: string) =>
  path.startsWith('/') ? path.slice(1) : path;
