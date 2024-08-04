// eslint-disable-next-line no-console

fetch('https://github.com/login/device/code', {
  method: 'POST',
  headers: {
    accept: 'application/json',
    'editor-version': 'Neovim/0.6.1',
    'editor-plugin-version': 'copilot.vim/1.16.0',
    'content-type': 'application/json',
    'user-agent': 'GithubCopilot/1.155.0',
    'accept-encoding': 'gzip,deflate,br',
  },
  body: JSON.stringify({
    client_id: 'Iv1.b507a08c87ecfe98',
    scope: 'read:user',
  }),
});

console.info('Service worker 2321312!');
