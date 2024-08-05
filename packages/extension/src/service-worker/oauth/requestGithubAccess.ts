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
const oauthStorage = createMemoizedExtensionStorage<GithubAccessTokenResult>({
  duration: 3600 * 1000, // 1 hour
  key: 'ouath',
});

/**
 * Waits for the user to grant access to the GitHub OAuth application.
 */
export const requestGithubAccess = pipe(
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
  oauthStorage.tryReadFromCacheFirst,
  TE.map(({ value }) => value),
);
