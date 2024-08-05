import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';

import {
  getGithubOAuthVerificationUrl,
  waitForGithubOAuthDeviceAccessToken,
  type GithubAccessTokenResult,
} from '@gh-copilot-ext/copilot-api';

import { createMemoizedExtensionStorage } from '../../helpers';
import { autofillGithubUserCode } from './autofillGithubUserCode';

/**
 * Just random numbers, hope they work :)
 */
const GITHUB_COPILOT_LANGUAGE_SERVER_CLIENT_ID = 'Iv1.b507a08c87ecfe98';

/**
 * The storage for the OAuth token.
 */
const OAuthStorage = createMemoizedExtensionStorage<GithubAccessTokenResult>({
  duration: 3600 * 1000, // 1 hour
  key: 'ouath',
});

/**
 * Opens the browser and waits for the user to grant access to the GitHub OAuth application.
 */
const openBrowserAndDoGithubOAuth = pipe(
  getGithubOAuthVerificationUrl({
    clientId: GITHUB_COPILOT_LANGUAGE_SERVER_CLIENT_ID,
    scopes: ['read:user'],
  }),
  TE.tap(autofillGithubUserCode),
  TE.chainW(({ deviceCode }) =>
    waitForGithubOAuthDeviceAccessToken({
      clientId: GITHUB_COPILOT_LANGUAGE_SERVER_CLIENT_ID,
      deviceCode,
    }),
  ),
);

/**
 * Waits for the user to grant access to the GitHub OAuth application.
 */
export const requestGithubAccess = pipe(
  OAuthStorage.tryReadFromCacheFirst(openBrowserAndDoGithubOAuth),
  TE.map(({ value }) => value.accessToken),
  // TODO: Add refresh token support.
);
