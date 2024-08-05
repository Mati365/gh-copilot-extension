import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';

import { TaggedError } from '@gh-copilot-ext/commons';
import {
  createGithubUrl,
  isGithubUrl,
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
      const tab = await chrome.tabs.create({
        url: verificationUri,
        active: true,
      });

      if (!tab.id) {
        throw new Error('Tab ID is not available');
      }

      // Wait for the user to enter the device code page.
      await waitForEnterDeviceCodePage(tab.id);
      await chrome.tabs.update(tab.id, {
        active: true,
      });

      // Autofill the user code.
      await chrome.scripting.executeScript({
        target: {
          tabId: tab.id,
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
const waitForEnterDeviceCodePage = (tabId: number) =>
  new Promise<chrome.tabs.Tab>((resolve, reject) => {
    // Listen for the tab to be updated to the page where the user enters the device code.
    const onTabUpdated = (
      updatedTabId: number,
      _: unknown,
      tab: chrome.tabs.Tab,
    ) => {
      if (updatedTabId !== tabId) {
        return;
      }

      const url = tab.url ?? '';

      // Ignore about:blank / non-http pages.
      if (!url.startsWith('http')) {
        return;
      }

      if (!isGithubUrl(url)) {
        // The user was redirected to a non-GitHub page.
        removeListeners();
        reject(new Error('User was redirected to non-github page!'));
      }

      if (tab.status === 'complete' && isGithubEnterDeviceCodeUrl(url)) {
        // The user is on the page where they enter the device code.
        removeListeners();
        resolve(tab);
      }
    };

    // Listen for the tab to be closed before the user enters the device code.
    const onTabRemoved = (removedTabId: number) => {
      if (removedTabId === tabId) {
        removeListeners();
        reject(
          new Error(
            'Tab was closed before the user could enter the device code',
          ),
        );
      }
    };

    const removeListeners = () => {
      chrome.tabs.onUpdated.removeListener(onTabUpdated);
      chrome.tabs.onRemoved.removeListener(onTabRemoved);
    };

    chrome.tabs.onUpdated.addListener(onTabUpdated);
    chrome.tabs.onRemoved.addListener(onTabRemoved);
  });

/**
 * Checks if the URL is the GitHub page where the user enters the device code.
 */
const isGithubEnterDeviceCodeUrl = (url: string) =>
  url.startsWith(createGithubUrl('login/device')) &&
  url.includes('skip_account_picker');
