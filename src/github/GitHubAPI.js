import Config from '../Config';
import ghFetch from './ghFetch';
import Logic from './GitHubLogic';

const getAllPages = async function (link, result = []) {
  if (!link) return result;
  const curr = await ghFetch(link, {}, true);
  const nextLink = Logic.getNextPage(curr.headers.get('Link'));
  result.push(curr);
  return getAllPages(nextLink, result);
};

const getUser = function () {
  return ghFetch('/user');
};

const getUserRepos = function () {
  return getAllPages(`${Config.baseURI}/user/repos?per_page=100&affiliation=owner,collaborator`);
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