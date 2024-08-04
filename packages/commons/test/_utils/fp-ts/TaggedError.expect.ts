import { expect } from 'vitest';
import * as E from 'fp-ts/Either';

expect.extend({
  toHaveTaggedError(received: E.Either<any, any>, tag: unknown) {
    return {
      pass: E.isLeft(received) && this.equals(received.left.tag, tag),
      message: () =>
        `expected ${JSON.stringify(received)} to have tagged error ${tag}!`,
    };
  },
});
