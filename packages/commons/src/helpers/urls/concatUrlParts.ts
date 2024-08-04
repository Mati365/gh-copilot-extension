import { concatUrls } from './concatUrls';

export const concatUrlPartsA = (parts: string[]): string =>
  parts.reduce((acc, part) => concatUrls(acc, part), '');

export const concatUrlParts = (...parts: string[]): string =>
  concatUrlPartsA(parts);

export const concatUrlParts2C =
  (...prefix: string[]) =>
  (b: string) =>
    concatUrlParts(...prefix, b);
