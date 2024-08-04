import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';

import { TaggedError } from '@gh-copilot-ext/commons';
import {
  createGithubUrl,
  type GithubVerificationUrlResult,
} from '@gh-copilot-ext/copilot-api';

/**
 * Autofill the user code on the tab opened with the verification URI.
 *
 * @param verificationUri The URI for user verification.
 * @param userCode The user code to be autofilled.
 */
export const autofillGithubUserCode = ({
  verificationUri,
  userCode,
}: GithubVerificationUrlResult) =>
  pipe(
    TE.fromTask(async () => {
      await chrome.tabs.create({
        url: verificationUri,
        active: true,
      });

      const tab = await waitForEnterDeviceCodePage();

      await chrome.tabs.update(tab.id!, {
        active: true,
      });

      await chrome.scripting.executeScript({
        target: {
          tabId: tab.id!,
          allFrames: true,
        },
        args: [userCode],
        func: code => {
          for (let i = 0; i < code.length; ++i) {
            const input = document.getElementById(
              `user-code-${i}`,
            ) as HTMLInputElement;
            input.value = code[i];
          }
          const submitButton = document.querySelector(
            '[action="/login/device/confirmation"] input[type="submit"]',
          ) as HTMLFormElement;

          submitButton.click();
        },
      });
    }),
    TE.mapLeft(AutofillGithubUserCodeError.of),
  );

/**
 * Represents an error that occurred while autofilling the user code on the GitHub access page.
 */
class AutofillGithubUserCodeError extends TaggedError.ofLiteral<Error>()(
  'AutofillGithubUserCodeError',
) {
  static of(error: Error) {
    return new AutofillGithubUserCodeError(error);
  }
}

/**
 * Waits for the user to enter the device code on the GitHub access page.
 *
 * @returns A promise that resolves with the tab object representing the page where the user entered the device code.
 */
const waitForEnterDeviceCodePage = () =>
  new Promise<chrome.tabs.Tab>(resolve => {
    const listener = (
      tabId: number,
      changeInfo: unknown,
      tab: chrome.tabs.Tab,
    ) => {
      if (
        tab.status === 'complete' &&
        isGithubEnterDeviceCodeUrl(tab.url ?? '')
      ) {
        chrome.tabs.onUpdated.removeListener(listener);
        resolve(tab);
      }
    };

    chrome.tabs.onUpdated.addListener(listener);
  });

/**
 * Checks if the URL is the GitHub page where the user enters the device code.
 */
const isGithubEnterDeviceCodeUrl = (url: string) =>
  url.startsWith(createGithubUrl('login/device')) &&
  url.includes('skip_account_picker');
