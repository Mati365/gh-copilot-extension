export function assert<T>(guard: (o: any) => o is T, o: any): asserts o is T {
  if (!guard(o)) {
    throw new Error(); // or add param for custom error
  }
}
