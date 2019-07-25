import Config from './Config';
import camelcaseKeys from 'camelcase-keys';

const baseURI = 'https://api.github.com/';

// https://github.com/github-tools/github/blob/master/lib/Requestable.js
const getNextPage = function (linksHeader = '') {
  const links = linksHeader.split(/\s*,\s*/); // splits and strips the urls
  return links.reduce(function(nextUrl, link) {
      if (link.search(/rel="next"/) !== -1) {
        return (link.match(/<(.*)>/) || [])[1];
      }

      return nextUrl;
  }, undefined);
}

const ghFetch = function (path, options = {}, fullPath = false) {
  const token = Config.token;
  const opt = Object.assign({}, options);
  opt.headers = Object.assign({
    'Content-Type': 'application/json',
    'Authorization': `token ${token}`,
  }, options.headers);

  const response = {};

  return fetch(`${fullPath ? '' : baseURI}${path}`, opt)
    .then((r) => {
      response.headers = r.headers;
      response.status = r.status;
      return r.json();
    })
    .then((r) => {
      response.body = camelcaseKeys(r, {deep: true});
      return response;
    });
};

const getAllPages = async function (link, result = []) {
  if (!link) return result;
  const curr = await ghFetch(link, {}, true);
  const nextLink = getNextPage(curr.headers.get('Link'));
  result.push(curr);
  return getAllPages(nextLink, result);
};

const getUser = function () {
  return ghFetch('user');
};

const getUserRepos = function () {
  return getAllPages(`${baseURI}user/repos?per_page=100`);
};

const getAllOrgs = function () {
  return ghFetch('user/orgs');
};

const getAllOrgRepos = function (orgName) {
  return getAllPages(`${baseURI}orgs/${orgName}/repos?per_page=100`);
};

export default {
  getUser,
  getUserRepos,
  getAllOrgs,
  getAllOrgRepos,
};