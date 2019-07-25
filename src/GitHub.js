import {flatten} from 'ramda';
import API from './GitHubAPI';
import Adapter from './GitHubAdapter';
import Storage from './Storage';

const getUser = function () {
  return Storage.get({user: null}).user || {};
};

const getAllOrgs = function () {
  return Storage.get({orgs: {}}).orgs || [];
};

const getAllSavedRepos = function () {
  return Storage.get({repos: {}}).repos || {};
};

const getAllOrgRepos = async function (orgName) {
  const savedRepos = await getAllSavedRepos();
  return savedRepos[orgName];
};

const updateUser = async function () {
  const response = await API.getUser();
  const user = Adapter.adaptUser(response.body);
  await Storage.set({user});

  return user;
};

const updateUserRepos = async function (username) {
  const response = await API.getUserRepos();
  const repos = flatten(response.map((repo) => repo.body)).map(Adapter.adaptRepo);
  const savedRepos = await getAllSavedRepos();
  savedRepos[username] = repos;
  await Storage.set({repos: savedRepos});

  return repos;
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
  getUser,
  getAllOrgs,
  getAllOrgRepos,
  getAllSavedRepos,
  updateUser,
  updateUserRepos,
  updateOrgs,
  updateAllOrgRepos,
  getEverything,
};