import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';

import type * as RE from 'fp-ts/ReaderEither';

/**
 * Abstract class representing a tagged error.
 *
 * @template T - The type of the tag.
 */
export abstract class TaggedError<
  T extends string,
  C extends object = {},
> extends Error {
  /**
   * The tag associated with the error.
   */
  abstract readonly tag: T;

  /**
   * Constructs a new TaggedError instance.
   */
  constructor(readonly context: C) {
    super();

    if ('captureStackTrace' in Error) {
      Error.captureStackTrace(this, TaggedError);
    }
  }

  /**
   * Creates a new TaggedLiteralError class with the specified tag.
   *
   * @param tag - The tag for the error.
   * @returns A new TaggedLiteralError class.
   */
  static ofLiteral<C extends object>() {
    return <const S extends string>(tag: S) =>
      class TaggedLiteralError extends TaggedError<S, C> {
        readonly tag = tag;
      };
  }
}

/**
 * Checks if the provided error is a TaggedError.
 *
 * @param error - The error to check.
 * @returns True if the error is a TaggedError, false otherwise.
 */
export const isTaggedError = (error: any): error is TaggedError<any> =>
  error && 'tag' in error;

/**
 * Catch a tagged error and apply a catch function to it.
 *
 * @template T - The type of the error tag.
 * @template E2 - The type of the error that the catch function can produce.
 * @template B - The type of the result produced by the catch function.
 * @param tag - The tag identifying the type of error to catch.
 * @param catchTask - The catch function to apply to the tagged error.
 */
export const catchEitherTagError =
  <const T extends string>(tag: T) =>
  <E, E2, B>(catchTask: RE.ReaderEither<Extract<E, TaggedError<T>>, E2, B>) =>
  <A>(
    task: E.Either<Extract<E, TaggedError<T>> extends never ? never : E, A>,
  ) =>
    pipe(
      task,
      E.foldW((error): E.Either<E | E2, A | B> => {
        if (isTaggedError(error) && error.tag === tag) {
          return catchTask(error as any);
        }

        return E.left(error);
      }, E.of),
    ) as E.Either<Exclude<E, TaggedError<T>> | E2, A | B>;
