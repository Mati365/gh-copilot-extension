import { dropFirstSlash } from './dropFirstSlash';
import { dropLastSlash } from './dropLastSlash';
import { isAbsoluteUrl } from './isAbsoluteUrl';

/**
 * Concatenates two URLs.
 *
 * @param a - The first URL.
 * @param b - The second URL.
 * @returns The concatenated URL.
 */
export const concatUrls = (a: string, b: string): string => {
  if (!a && b) {
    return b;
  }

  if (!b || b === '/') {
    return a;
  }

  if (b.startsWith('//')) {
    b = `https:${b}`;
  }

  if (!a || isAbsoluteUrl(b)) {
    return b;
  }

  const truncatedLeft = dropLastSlash(a);
  const truncatedRight = dropFirstSlash(b);

  if (truncatedRight[0] === '?') {
    return `${truncatedLeft}${truncatedRight}`;
  }

  return [truncatedLeft, truncatedRight].join('/');
};
