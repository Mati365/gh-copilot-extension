import { waitForGithubAccess } from './oauth';

// eslint-disable-next-line no-console
waitForGithubAccess().then(console.info);
