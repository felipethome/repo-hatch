import Storage from './common/Storage';

const gitHubBaseURI = 'https://api.github.com';

const getToken = async function () {
  return (await Storage.get({token: 'Not defined.'})).token;
};

export default {
  gitHubBaseURI,
  getToken,
};