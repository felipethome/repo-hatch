jest.mock('../../src/Config', () => ({
  gitHubBaseURI: 'https://api.github.com',
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

  it('calls the right url to get user', (done) => {
    fetch.once(JSON.stringify({}));

    API.getUser().then(() => {
      expect(fetch.mock.calls[0][0]).toEqual(`${Config.gitHubBaseURI}/user`);
      done();
    });
  });

  it('calls the right url to get user repos', (done) => {
    fetch.once(JSON.stringify({}));

    API.getUserRepos().then(() => {
      expect(fetch.mock.calls[0][0]).toEqual(`${Config.gitHubBaseURI}/user/repos?per_page=100&affiliation=owner,collaborator`);
      done();
    });
  });

  it('calls the right url to get orgs', (done) => {
    fetch.once(JSON.stringify({}));

    API.getOrgs().then(() => {
      expect(fetch.mock.calls[0][0]).toEqual(`${Config.gitHubBaseURI}/user/orgs`);
      done();
    });
  });

  it('calls the right url to get organization repos', (done) => {
    fetch.once(JSON.stringify({}));
    const orgName = 'some';

    API.getAllOrgRepos(orgName).then(() => {
      expect(fetch.mock.calls[0][0]).toEqual(`${Config.gitHubBaseURI}/orgs/${orgName}/repos?per_page=100`);
      done();
    });
  });
});