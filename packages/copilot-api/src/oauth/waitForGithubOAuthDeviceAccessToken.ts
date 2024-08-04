import { flow } from 'fp-ts/function';

import { waitUntilTE } from '@gh-copilot-ext/commons';
import { getGithubOAuthDeviceAccessToken } from './getGithubOAuthDeviceAccessToken';

/**
 * Waits for the GitHub OAuth device access token to be available.
 *
 * @param context - The context for retrieving the access token.
 * @returns A task either containing the access token or an error.
 */
export const waitForGithubOAuthDeviceAccessToken = flow(
  getGithubOAuthDeviceAccessToken,
  waitUntilTE({
    delay: () => 5000,
    maxRetries: 10,
    waitBeforeFirstCheck: true,
  }),
);
