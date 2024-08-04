import * as E from 'fp-ts/Either';
import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import type { TaskEither } from 'fp-ts/TaskEither';

/**
 * Tries to execute a TaskEither and throws an error if it fails.
 *
 * @param taskEither - The TaskEither to execute.
 * @returns A Task that resolves to the result of the TaskEither if it succeeds.
 * @throws The error value of the TaskEither if it fails.
 */
export const tryOrThrowTE = <E, A>(taskEither: TaskEither<E, A>): T.Task<A> =>
  pipe(
    taskEither,
    T.map(either => {
      if (E.isLeft(either)) {
        // eslint-disable-next-line @typescript-eslint/no-throw-literal
        throw either.left;
      }

      return either.right;
    }),
  );
