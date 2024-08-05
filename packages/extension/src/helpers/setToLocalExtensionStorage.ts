import * as TE from 'fp-ts/TaskEither';
import { TaggedError } from '@gh-copilot-ext/commons';

/**
 * Sets a value to the local extension storage.
 *
 * @param name - The name of the value to set.
 * @param value - The value to set.
 * @returns A task that sets the value to the local extension storage.
 */
export const setToLocalExtensionStorage = (name: string, value: any) =>
  TE.tryCatch(
    async () => chrome.storage.local.set({ [name]: value }),
    LocalExtensionStorageSetError.of,
  );

/**
 * Represents an error that occurs during setting to local extension storage.
 */
export class LocalExtensionStorageSetError extends TaggedError.ofLiteral<any>()(
  'LocalExtensionStorageSetError',
) {
  static of(error: any) {
    return new LocalExtensionStorageSetError(error);
  }
}
