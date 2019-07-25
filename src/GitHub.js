import API from './GitHubAPI';
import Adapter from './GitHubAdapter';

const getAllOrgs = function () {
  return API.getAllOrgs();
};

const getAllOrgRepos = function () {
  return API.getAllOrgRepos();
};

export default {
  getAllOrgs,
  getAllOrgRepos,
};