import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';

import {
  getGithubOAuthVerificationUrl,
  waitForGithubOAuthDeviceAccessToken,
} from '@gh-copilot-ext/copilot-api';

import { autofillGithubUserCode } from './autofillGithubUserCode';

/**
 * Just random numbers, hope they work :)
 */
const GITHUB_COPILOT_LANGUAGE_SERVER_CLIENT_ID = 'Iv1.b507a08c87ecfe98';

/**
 * Waits for the user to grant access to the GitHub OAuth application.
 */
export const waitForGithubAccess = pipe(
  getGithubOAuthVerificationUrl({
    clientId: GITHUB_COPILOT_LANGUAGE_SERVER_CLIENT_ID,
    scopes: ['read:user'],
  }),
  TE.chainFirstW(autofillGithubUserCode),
  TE.chainW(({ deviceCode }) =>
    waitForGithubOAuthDeviceAccessToken({
      clientId: GITHUB_COPILOT_LANGUAGE_SERVER_CLIENT_ID,
      deviceCode,
    }),
  ),
);
