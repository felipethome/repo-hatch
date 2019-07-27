jest.mock('../src/Config', () => ({
  getToken: () => Promise.resolve('abc')
}));

import API from '../src/GitHubAPI';
import jestFetchMock from 'jest-fetch-mock';

global.fetch = jestFetchMock;

describe('testing api', () => {
  beforeEach(() => {
    fetch.resetMocks()
  });

  test('github fetch', (done) => {
    const body = {
      attr: 'a',
      other_attr: 'b',
    };

    const internalBody = {
      attr: 'a',
      otherAttr: 'b',
    };

    fetch.once(JSON.stringify(body));

    API.ghFetch('/user').then((res) => {
      expect(res.body).toEqual(internalBody);
      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(fetch.mock.calls[0][0]).toEqual(`${API.baseURI}/user`);
      expect(fetch.mock.calls[0][1]).toEqual({
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'token abc',
        }
      });
      done();
    });
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
      expect(fetch.mock.calls[0][0]).toEqual(`${API.baseURI}/user`);
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
      expect(fetch.mock.calls[0][0]).toEqual(`${API.baseURI}/user/orgs`);
      done();
    });
  });
});