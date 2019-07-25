import {pick} from 'ramda';

const adaptUser = function (user) {
  return pick(['id', 'login', 'avatarUrl', 'name', 'company', 'email'], user);
};

const adaptOrg = function (org) {
  return pick(['id', 'login', 'avatarUrl', 'description'], org);
};

const adaptRepo = function (repo) {
  return pick(['id', 'name', 'fullName', 'private', 'fork'], repo);
};

export default {
  adaptUser,
  adaptOrg,
  adaptRepo,
};