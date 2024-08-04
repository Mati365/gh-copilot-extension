import type { NonEmptyArray } from 'fp-ts/NonEmptyArray';

import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { z } from 'zod';

import {
  CamelCaseObjectV,
  TaggedError,
  type ZodParseError,
} from '@gh-copilot-ext/commons';

import { createGithubRequestTE } from '../helpers';

/**
 * Represents a GitHub OAuth scope.
 */
type GithubOAuthScope = `${string}:${string}`;

/**
 * Represents the context for a GitHub OAuth flow.
 */
export type GithubOAuthContext = {
  /**
   * The client ID to use for the OAuth flow.
   */
  clientId: string;

  /**
   * The scopes to request from the user.
   */
  scopes: NonEmptyArray<GithubOAuthScope>;
};

/**
 * Retrieves the GitHub OAuth verification URL.
 *
 * @param options - The options for retrieving the verification URL.
 * @param options.clientId - The client ID for the OAuth application.
 * @param options.scopes - The scopes to request access for.
 * @returns A task either containing the verification URL or an error.
 */
export const getGithubOAuthVerificationUrl = ({
  clientId,
  scopes,
}: GithubOAuthContext) =>
  pipe(
    GithubVerificationUrlResultV,
    createGithubRequestTE('login/device/code', {
      method: 'POST',
      body: {
        client_id: clientId,
        scope: scopes.join(' '),
      },
    }),
    TE.mapLeft(GithubOAuthVerificationError.of),
  );

/**
 * Represents an error that occurred while verifying the GitHub OAuth flow.
 */
class GithubOAuthVerificationError extends TaggedError.ofLiteral<
  Error | ZodParseError
>()('GithubOAuthVerificationError') {
  static of(error: Error) {
    return new GithubOAuthVerificationError(error);
  }
}

/**
 * Represents the result of retrieving the GitHub OAuth verification URL.
 */
const GithubVerificationUrlResultV = CamelCaseObjectV.pipe(
  z.object({
    deviceCode: z.string(),
    userCode: z.string(),
    verificationUri: z.string(),
    expiresIn: z.number(),
    interval: z.number(),
  }),
);

/**
 * Represents the result of retrieving the GitHub OAuth verification URL.
 */
export type GithubVerificationUrlResult = z.infer<
  typeof GithubVerificationUrlResultV
>;
