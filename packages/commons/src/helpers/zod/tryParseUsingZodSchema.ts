import type { IO } from 'fp-ts/IO';

import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import { z, type ZodFirstPartySchemaTypes } from 'zod';

import { TaggedError } from '../../types';

/**
 * Tries to parse a value using a Zod schema.
 *
 * @param schema - The Zod schema to use for parsing.
 * @param value - The value to parse.
 * @returns The result of parsing the value using the Zod schema.
 */
export const tryParseUsingZodSchema =
  <S extends ZodFirstPartySchemaTypes>(schema: S) =>
  (value: unknown): ZodParseResultOrError<z.infer<S>> =>
    pipe(() => schema.parse(value) as z.infer<S>, ZodParseError.tryIO);

/**
 * Represents an error that occurs during parsing using a Zod schema.
 */
export class ZodParseError extends TaggedError.ofLiteral<z.ZodError>()(
  'ParseError',
) {
  static tryIO = <T>(task: IO<T>) =>
    E.tryCatch(task, (err: any) => {
      if (err instanceof z.ZodError) {
        return new ZodParseError(err);
      }

      throw err;
    });
}

/**
 * Represents the result of parsing using a Zod schema or an error.
 *
 * @template C - The type of the parsed value.
 */
export type ZodParseResultOrError<C> = E.Either<ZodParseError, C>;
