import {flatten} from 'ramda';
import API from './GitHubAPI';
import Adapter from './GitHubAdapter';
import Storage from '../common/Storage';

const getAllSavedRepos = async function () {
  return (await Storage.get({repos: {}})).repos;
};

const getDefaults = async function () {
  const defaults = (await Storage.get({defaults: {
    defaultRepoSource: '',
  }})).defaults;
  return defaults;
};

const updateDefaults = async function(defaults) {
  const savedDefaults = await getDefaults();
  return Storage.set({defaults: Object.assign(savedDefaults, defaults)});
};

const getUser = async function () {
  return (await Storage.get({user: {}})).user;
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

const getOrgs = async function () {
  return (await Storage.get({orgs: {}})).orgs;
};

const updateOrgs = async function () {
  const response = await API.getOrgs();
  const orgs = response.body.map(Adapter.adaptOrg);
  await Storage.set({orgs});

  return orgs;
};

const getAllOrgRepos = async function (orgName) {
  const savedRepos = await getAllSavedRepos();
  return savedRepos[orgName];
};

const updateAllOrgRepos = async function (orgName) {
  const response = await API.getAllOrgRepos(orgName);
  const repos = flatten(response.map((repo) => repo.body)).map(Adapter.adaptRepo);
  const savedRepos = await getAllSavedRepos();
  savedRepos[orgName] = repos;
  await Storage.set({repos: savedRepos});

  return repos;
};

const getToken = async function () {
  return (await Storage.get({token: ''})).token;
};

const updateToken = async function (newToken) {
  await Storage.set({token: newToken});
  return newToken;
};

const getEverything = function () {
  return Storage.get(['orgs', 'repos', 'user', 'defaults', 'token']);
};

export default {
  getAllSavedRepos,
  getDefaults,
  updateDefaults,
  getUser,
  updateUser,
  updateUserRepos,
  getOrgs,
  updateOrgs,
  getAllOrgRepos,
  updateAllOrgRepos,
  getToken,
  updateToken,
  getEverything,
};