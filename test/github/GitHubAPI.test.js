jest.mock('../../src/Config', () => ({
  baseURI: 'https://api.github.com',
  getToken: () => Promise.resolve('abc'),
}));

import API from '../../src/github/GitHubAPI';
import Config from '../../src/Config';
import jestFetchMock from 'jest-fetch-mock';

global.fetch = jestFetchMock;

describe('testing GitHub api', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  test('GitHub user', (done) => {
    fetch.once(JSON.stringify({}));

    API.getUser().then(() => {
      expect(fetch.mock.calls[0][0]).toEqual(`${Config.baseURI}/user`);
      done();
    });
  });

  test('GitHub user repos', (done) => {
    fetch.once(JSON.stringify({}));

    API.getUserRepos().then(() => {
      expect(fetch.mock.calls[0][0]).toEqual(`${Config.baseURI}/user/repos?per_page=100&affiliation=owner,collaborator`);
      done();
    });
  });

  test('GitHub organizations', (done) => {
    fetch.once(JSON.stringify({}));

    API.getOrgs().then(() => {
      expect(fetch.mock.calls[0][0]).toEqual(`${Config.baseURI}/user/orgs`);
      done();
    });
  });

  test('GitHub organization repos', (done) => {
    fetch.once(JSON.stringify({}));
    const orgName = 'some';

    API.getAllOrgRepos(orgName).then(() => {
      expect(fetch.mock.calls[0][0]).toEqual(`${Config.baseURI}/orgs/${orgName}/repos?per_page=100`);
      done();
    });
  });
});