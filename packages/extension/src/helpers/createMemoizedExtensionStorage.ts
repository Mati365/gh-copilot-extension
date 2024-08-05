import * as TE from 'fp-ts/TaskEither';
import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { z } from 'zod';

import { TaggedError } from '@gh-copilot-ext/commons';
import { readFromLocalExtensionStorage } from './readFromLocalExtensionStorage';

import {
  setToLocalExtensionStorage,
  type LocalExtensionStorageSetError,
} from './setToLocalExtensionStorage';

export type MemoizeContext = {
  /**
   * The duration to store the value in the storage.
   */
  duration: number;

  /**
   * The name of the storage to use.
   */
  key: string;
};

/**
 * Memoizes the result of a task in the local extension storage.
 *
 * @param duration The duration in milliseconds for which the memoized value should be stored.
 * @param key The key under which the memoized value should be stored.
 */
export const createMemoizedExtensionStorage = <T>({
  duration,
  key,
}: MemoizeContext) => {
  /**
   * Reads a value from the local extension storage.
   */
  const tryReadFromStorage = pipe(
    // Read the value from the local extension storage.
    readFromLocalExtensionStorage(key, MemoizedStorageEntryV),

    // If the value is expired, raise an error.
    TE.chainEitherKW(entry =>
      entry.expiry < Date.now()
        ? E.left(
            new LocalExtensionStorageValueExpiredError({
              key,
            }),
          )
        : E.right(entry as MemoizedStorageEntry<T>),
    ),
  );

  /**
   * Sets a value to the local extension storage.
   */
  const trySetInStorage = (value: T) =>
    pipe(
      TE.Do,
      TE.bind('expiry', () => TE.of(Date.now() + duration)),
      TE.tap(({ expiry }) =>
        setToLocalExtensionStorage(key, {
          value,
          expiry,
        }),
      ),
      TE.map(
        ({ expiry }): MemoizedStorageEntry<T> => ({
          value,
          expiry,
        }),
      ),
    );

  /**
   * Memoizes the result of a task in the local extension storage.
   */
  const tryReadFromCacheFirst = <E>(
    task: TE.TaskEither<E, T>,
  ): TE.TaskEither<
    E | LocalExtensionStorageSetError,
    MemoizedStorageEntry<T>
  > =>
    pipe(
      tryReadFromStorage,

      // If the value is not expired, return it.
      TE.fold(
        () => pipe(task, TE.chainW(trySetInStorage)),
        val => TE.right(val as MemoizedStorageEntry<T>),
      ),
    );

  return {
    tryRead: tryReadFromStorage,
    trySet: trySetInStorage,
    tryReadFromCacheFirst,
  };
};

/**
 * Represents an error that occurs when a value is missing in the local extension storage.
 */
class LocalExtensionStorageValueExpiredError extends TaggedError.ofLiteral<{
  key: string;
}>()('LocalExtensionStorageValueExpiredError') {}

/**
 * Represents a memoized storage entry.
 */
const MemoizedStorageEntryV = z.object({
  value: z.record(z.any()),
  expiry: z.number(),
});

/**
 * Represents a memoized storage entry.
 */
export type MemoizedStorageEntry<V> = {
  value: V;
  expiry: number;
};
