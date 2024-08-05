import type { ZodFirstPartySchemaTypes } from 'zod';
import * as TE from 'fp-ts/TaskEither';
import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';

import { TaggedError, tryParseUsingZodSchema } from '@gh-copilot-ext/commons';

/**
 * Reads a value from the local extension storage.
 *
 * @param name - The name of the value to read.
 * @param schema - The Zod schema to validate the value against.
 */
export const readFromLocalExtensionStorage = <
  S extends ZodFirstPartySchemaTypes,
>(
  name: string,
  schema: S,
) =>
  pipe(
    async (): Promise<E.Either<ReadFromLocalExtensionStorageError, any>> => {
      try {
        const result = await chrome.storage.local.get(name);

        if (result[name] === undefined) {
          return E.left(new LocalExtensionStorageMissingValueError({ name }));
        }

        return E.right(result[name]);
      } catch (e) {
        return E.left(new LocalExtensionStorageReadError(e));
      }
    },
    TE.chainEitherKW(tryParseUsingZodSchema(schema)),
  );

/**
 * Represents an error that occurs during reading from local extension storage.
 */
export type ReadFromLocalExtensionStorageError =
  | LocalExtensionStorageReadError
  | LocalExtensionStorageMissingValueError;

/**
 * Represents an error that occurs during reading from local extension storage.
 */
export class LocalExtensionStorageReadError extends TaggedError.ofLiteral<any>()(
  'LocalExtensionStorageReadError',
) {}

/**
 * Represents an error that occurs when a value is missing in the local extension storage.
 */
export class LocalExtensionStorageMissingValueError extends TaggedError.ofLiteral<{
  name: string;
}>()('LocalExtensionStorageMissingValueError') {}
