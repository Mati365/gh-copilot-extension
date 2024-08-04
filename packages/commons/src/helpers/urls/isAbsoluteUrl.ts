/**
 * Checks if a given URL is an absolute URL.
 *
 * @param url - The URL to check.
 * @returns A boolean indicating whether the URL is absolute or not.
 */
export const isAbsoluteUrl = (url: string): boolean => /^https?:\/\//.test(url);
