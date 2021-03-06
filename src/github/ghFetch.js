import camelcaseKeys from 'camelcase-keys';
import Config from '../Config';

const ghFetch = async function (path, options = {}, fullPath = false) {
  const opt = Object.assign({}, options);
  opt.headers = Object.assign({
    'Content-Type': 'application/json',
    Authorization: `token ${(await Config.getToken())}`,
  }, options.headers);

  const response = {};

  return fetch(`${fullPath ? '' : Config.gitHubBaseURI}${path}`, opt)
    .then((r) => {
      response.headers = r.headers;
      response.status = r.status;
      response.statusText = r.statusText;
      response.ok = r.ok;
      return r.json();
    })
    .then((r) => {
      if (response.ok) {
        response.body = camelcaseKeys(r, {deep: true});
        return response;
      }
      else {
        throw Error(r.message);
      }
    });
};

export default ghFetch;