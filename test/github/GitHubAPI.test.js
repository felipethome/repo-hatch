jest.mock('../../src/Config', () => ({
  baseURI: 'https://api.github.com',
  getToken: () => Promise.resolve('abc')
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

  test('GitHub organizations', (done) => {
    fetch.once(JSON.stringify({}));

    API.getOrgs().then((res) => {
      expect(fetch.mock.calls[0][0]).toEqual(`${Config.baseURI}/user/orgs`);
      done();
    });
  });
});