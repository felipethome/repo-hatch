import {flatten} from 'ramda';
import API from './GitHubAPI';
import Adapter from './GitHubAdapter';
import Storage from './Storage';

const getAllOrgs = async function () {
  const savedOrgs = (await Storage.get(['orgs'])) || {};
  return savedOrgs;
};

const getAllSavedRepos = async function () {
  const savedRepos = (await Storage.get(['repos'])) || {};
  return savedRepos;
};

const getAllOrgRepos = async function (orgName) {
  const savedRepos = await getAllSavedRepos();
  return savedRepos[orgName];
};

const updateOrgs = async function () {
  const response = await API.getAllOrgs();
  const orgs = response.body.map(Adapter.adaptOrg);
  await Storage.set({orgs});

  return orgs;
};

const updateAllOrgRepos = async function (orgName) {
  const response = await API.getAllOrgRepos(orgName);
  const repos = flatten(response.map((repo) => repo.body)).map(Adapter.adaptRepo);
  const savedRepos = await getAllSavedRepos();
  savedRepos[orgName] = repos;
  await Storage.set({repos: savedRepos});

  return repos;
};

const getEverything = function () {
  return Storage.get(['orgs', 'repos']);
};

export default {
  getAllOrgs,
  getAllOrgRepos,
  updateOrgs,
  updateAllOrgRepos,
  getEverything,
};