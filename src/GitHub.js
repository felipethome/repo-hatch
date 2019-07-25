import API from './GitHubAPI';
import Adapter from './GitHubAdapter';
import {flatten, pipe} from 'ramda';

const getAllOrgs = async function () {
  const orgs = await API.getAllOrgs();
  return orgs.body.map(Adapter.adaptOrg);
};

const getAllOrgRepos = async function (orgName) {
  const response = await API.getAllOrgRepos(orgName);
  const repos = flatten(response.map((repo) => repo.body)).map(Adapter.adaptRepo);
  return repos;
};

export default {
  getAllOrgs,
  getAllOrgRepos,
};