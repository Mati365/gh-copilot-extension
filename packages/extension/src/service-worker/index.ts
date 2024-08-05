import { requestGithubAccess } from './oauth';

chrome.runtime.onInstalled.addListener(() => {
  requestGithubAccess();
});
