const gitHubBaseURI = 'https://api.github.com';

const getToken = function () {
  return Storage.get({token: 'Not defined.'});
};

export default {
  gitHubBaseURI,
  getToken,
};