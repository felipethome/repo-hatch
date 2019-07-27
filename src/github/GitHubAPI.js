import Config from '../Config';
import ghFetch from './ghFetch';

// https://github.com/github-tools/github/blob/master/lib/Requestable.js
const getNextPage = function (linksHeader) {
  const links = (linksHeader || '').split(/\s*,\s*/); // splits and strips the urls
  return links.reduce((nextUrl, link) => {
    if (link.search(/rel="next"/) !== -1) {
      return (link.match(/<(.*)>/) || [])[1];
    }

    return nextUrl;
  }, undefined);
};

const getAllPages = async function (link, result = []) {
  if (!link) return result;
  const curr = await ghFetch(link, {}, true);
  const nextLink = getNextPage(curr.headers.get('Link'));
  result.push(curr);
  return getAllPages(nextLink, result);
};

const getUser = function () {
  return ghFetch('/user');
};

const getUserRepos = function () {
  return getAllPages(`${Config.Config.baseURI}/user/repos?per_page=100&affiliation=owner,collaborator`);
};

const getOrgs = function () {
  return ghFetch('/user/orgs');
};

const getAllOrgRepos = function (orgName) {
  return getAllPages(`${Config.baseURI}/orgs/${orgName}/repos?per_page=100`);
};

export default {
  getNextPage,
  getAllPages,
  getUser,
  getUserRepos,
  getOrgs,
  getAllOrgRepos,
};