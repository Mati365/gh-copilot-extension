import type { OverrideProperties } from 'type-fest';
import type { ZodFirstPartySchemaTypes } from 'zod';

import { pipe } from 'fp-ts/function';
import * as TE from 'fp-ts/TaskEither';

import { tryParseUsingZodSchema } from '@gh-copilot-ext/commons';
import { createGithubUrl } from './createGithubUrl';

/**
 * Represents the initialization options for a GitHub request.
 * Extends the `RequestInit` type by allowing a `body` property of type `Record<string, any>`.
 */
type GithubRequestInit = OverrideProperties<
  Omit<RequestInit, 'headers'>,
  {
    body?: Record<string, any>;
  }
>;

/**
 * Creates a task that sends a request to the GitHub API.
 *
 * @param path - The path of the API endpoint.
 * @param options - The options for the request.
 * @returns A function that, when called, sends the request to the GitHub API.
 */
export const createGithubRequestTask =
  (path: string, { method, body, ...init }: GithubRequestInit = {}) =>
  async () => {
    const result = await fetch(createGithubUrl(path), {
      method: method ?? 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Accept-Encoding': 'gzip,deflate,br',
        'User-Agent': 'GithubCopilot/1.155.0',
      },
      ...init,
      ...(body && {
        body: JSON.stringify(body),
      }),
    });

    return result.json();
  };

/**
 * Creates a task that sends a request to the GitHub API and parses the response using the provided Zod schema.
 */
export const createGithubRequestTE =
  (path: string, init?: GithubRequestInit) =>
  <S extends ZodFirstPartySchemaTypes>(schema: S) =>
    pipe(
      createGithubRequestTask(path, init),
      TE.fromTask,
      TE.chainEitherK(tryParseUsingZodSchema(schema)),
    );
