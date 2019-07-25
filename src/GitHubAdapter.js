import {pick} from 'ramda';

const adaptOrg = function (org) {
  return pick(['id', 'login', 'avatarUrl', 'description'], org);
};

const adaptRepo = function (repo) {
  return pick(['id', 'name', 'fullName', 'private', 'fork'], repo);
};