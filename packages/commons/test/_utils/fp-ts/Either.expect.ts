import { expect } from 'vitest';
import * as E from 'fp-ts/Either';

expect.extend({
  toBeRight(received: E.Either<unknown, unknown>) {
    return {
      pass: E.isRight(received),
      message: () => `expected ${JSON.stringify(received)} to be right!`,
    };
  },

  toBeRightStrictEqual(
    received: E.Either<unknown, unknown>,
    expected: unknown,
  ) {
    return {
      pass: E.isRight(received) && this.equals(received.right, expected),
      message: () =>
        `expected ${JSON.stringify(received)} to be right ${JSON.stringify(expected)}`,
    };
  },
  toBeLeftStrictEqual(received, expected) {
    return {
      pass: E.isLeft(received) && this.equals(received.left, expected),
      message: () =>
        `expected ${JSON.stringify(received)} to be left ${JSON.stringify(expected)}`,
    };
  },
});
