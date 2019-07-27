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
    fetch.resetMocks()
  });

  test('gets the GitHub user', (done) => {
    const userResponse = {
      "login": "octocat",
      "id": 1,
      "node_id": "MDQ6VXNlcjE=",
      "avatar_url": "https://github.com/images/error/octocat_happy.gif",
      "type": "User",
      "name": "monalisa octocat",
      "company": "GitHub",
      "location": "San Francisco",
      "email": "octocat@github.com",
    };

    const internalUserResponse = {
      "login": "octocat",
      "id": 1,
      "nodeId": "MDQ6VXNlcjE=",
      "avatarUrl": "https://github.com/images/error/octocat_happy.gif",
      "type": "User",
      "name": "monalisa octocat",
      "company": "GitHub",
      "location": "San Francisco",
      "email": "octocat@github.com",
    };

    fetch.once(JSON.stringify(userResponse));

    API.getUser().then((res) => {
      expect(res.body).toEqual(internalUserResponse);
      expect(fetch.mock.calls[0][0]).toEqual(`${Config.baseURI}/user`);
      done();
    });
  });

  test('gets the GitHub user organizations', (done) => {
    const orgsResponse = [{
      "login": "octocat",
      "id": 1,
      "node_id": "MDQ6VXNlcjE=",
      "avatar_url": "https://github.com/images/error/octocat_happy.gif",
    }];

    const internalOrgsResponse = [{
      "login": "octocat",
      "id": 1,
      "nodeId": "MDQ6VXNlcjE=",
      "avatarUrl": "https://github.com/images/error/octocat_happy.gif",
    }];

    fetch.once(JSON.stringify(orgsResponse));

    API.getOrgs().then((res) => {
      expect(res.body).toEqual(internalOrgsResponse);
      expect(fetch.mock.calls[0][0]).toEqual(`${Config.baseURI}/user/orgs`);
      done();
    });
  });
});