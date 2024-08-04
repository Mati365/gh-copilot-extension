/* eslint-disable no-await-in-loop */
import { either as E, type taskEither as TE } from 'fp-ts';
import { timeout } from './timeout';

export type WaitUntilAttrs = {
  /**
   * The maximum number of retries.
   */
  maxRetries: number;

  /**
   * Indicates whether to wait before the first check.
   */
  waitBeforeFirstCheck?: boolean;

  /**
   * A function that calculates the delay between retries.
   */
  delay: (retry: number) => number;
};

/**
 * A higher-order function that waits until a task either succeeds or reaches the maximum number of retries.
 *
 * @param waitBeforeFirstCheck - Determines whether to wait before the first check or not.
 * @param maxRetries - The maximum number of retries.
 * @param delay - A function that calculates the delay between retries.
 */
export const waitUntilTE =
  ({ waitBeforeFirstCheck, maxRetries, delay }: WaitUntilAttrs) =>
  <T, E>(task: TE.TaskEither<E, T>): TE.TaskEither<E, T> =>
  async () => {
    let lastError: E.Left<E> | null = null;

    for (let i = 0; i < maxRetries; ++i) {
      const result = await task();
      const waitTime = delay(i + 1);

      if (waitBeforeFirstCheck) {
        await timeout(waitTime);
      }

      if (E.isRight(result)) {
        return result;
      }

      lastError = result;

      if (!waitBeforeFirstCheck) {
        await timeout(waitTime);
      }
    }

    return lastError!;
  };
