/**
 * Removes the trailing slash from a URL if it exists.
 *
 * @param url - The URL to remove the trailing slash from.
 * @returns The URL without the trailing slash.
 */
export const dropLastSlash = (url: string): string => {
  if (!url) {
    return '';
  }

  return url.endsWith('/') ? url.slice(0, -1) : url;
};
