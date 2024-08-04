import 'vitest';

declare module 'vitest' {
  interface CustomMatchers<R = unknown> {
    toBeRight(): R;
    toBeRightStrictEqual(expected: any): R;
    toBeLeftStrictEqual(expected: any): R;
    toHaveTaggedError(expected: any): R;
  }

  interface Assertion<T = any> extends CustomMatchers<T> {}
  interface AsymmetricMatchersContaining extends CustomMatchers {}
}
