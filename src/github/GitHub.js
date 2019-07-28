import {flatten} from 'ramda';
import uuidv4 from 'uuid/v4';
import API from './GitHubAPI';
import Adapter from './GitHubAdapter';
import Storage from '../common/Storage';

const defaultActions = {
  p: {id: uuidv4(), name: 'p', action: 'pulls'},
  i: {id: uuidv4(), name: 'i', action: 'issues'},
  t: {id: uuidv4(), name: 't', action: 'find/master'},
  s: {id: uuidv4(), name: 's', action: 'search'},
};

const getDefaultRepoSource = async function () {
  const savedOptions = await Storage.get({defaults: {}, user: {}});
  return savedOptions.defaults.defaultRepoSource || savedOptions.user.login;
};

const getAllSavedRepos = async function () {
  return (await Storage.get({repos: {}})).repos;
};

const getDefaults = async function () {
  const defaults = (await Storage.get({defaults: {
    defaultRepoSource: '',
  }})).defaults;
  return defaults;
};

const updateDefaults = async function (defaults) {
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

const getDefaultAction = async function () {
  return (await Storage.get({defaultAction: ''})).defaultAction;
};

const getSavedActions = async function () {
  return (await Storage.get({actions: defaultActions})).actions;
};

const getEverything = function () {
  return Storage.get(null);
};

export default {
  getDefaultRepoSource,
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
  getDefaultAction,
  getSavedActions,
  getEverything,
};