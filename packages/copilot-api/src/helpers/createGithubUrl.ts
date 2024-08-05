import { concatUrlParts2C } from '@gh-copilot-ext/commons';

/**
 * The Github domain.
 */
export const GITHUB_DOMAIN = 'https://github.com';

/**
 * Create a Github URL
 */
export const createGithubUrl = concatUrlParts2C(GITHUB_DOMAIN);
