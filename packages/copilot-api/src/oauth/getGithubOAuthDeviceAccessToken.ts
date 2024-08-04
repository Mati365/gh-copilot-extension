import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { z } from 'zod';

import { CamelCaseObjectV, TaggedError } from '@gh-copilot-ext/commons';
import { createGithubRequestTE } from '../helpers';

/**
 * Represents the context for retrieving the GitHub OAuth access token.
 */
export type GithubGetDeviceAccessTokenContext = {
  /**
   * The client ID for the OAuth application.
   */
  clientId: string;

  /**
   * The device code to wait for.
   */
  deviceCode: string;

  /**
   * The grant type to use for the OAuth flow.
   */
  grantType?: string;
};

/**
 * Retrieves the GitHub OAuth access token using the device code.
 *
 * @param context - The context for retrieving the access token.
 * @returns A task either containing the access token or an error.
 */
export const getGithubOAuthDeviceAccessToken = ({
  clientId,
  deviceCode,
  grantType = 'urn:ietf:params:oauth:grant-type:device_code',
}: GithubGetDeviceAccessTokenContext) =>
  pipe(
    GithubAccessTokenResultV,
    createGithubRequestTE('login/oauth/access_token', {
      method: 'POST',
      body: {
        client_id: clientId,
        device_code: deviceCode,
        grant_type: grantType,
      },
    }),
    TE.mapLeft(GithubAccessTokenError.of),
  );

/**
 * Represents an error that occurred while fetching the GitHub OAuth access token.
 */
class GithubAccessTokenError extends TaggedError.ofLiteral<Error>()(
  'GithubOAuthVerificationError',
) {
  static of(error: Error) {
    return new GithubAccessTokenError(error);
  }
}

/**
 * Represents the result of retrieving the GitHub OAuth verification URL.
 */
export const GithubAccessTokenResultV = CamelCaseObjectV.pipe(
  z.object({
    accessToken: z.string(),
  }),
);

/**
 * Represents the result of retrieving the GitHub OAuth verification URL.
 */
export type GithubAccessTokenResult = z.infer<typeof GithubAccessTokenResultV>;
