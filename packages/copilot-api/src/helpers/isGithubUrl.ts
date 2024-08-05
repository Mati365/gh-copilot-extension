import * as S from 'fp-ts/string';
import { GITHUB_DOMAIN } from './createGithubUrl';

/**
 * Checks if the URL is a GitHub URL.
 */
export const isGithubUrl = S.startsWith(GITHUB_DOMAIN);
