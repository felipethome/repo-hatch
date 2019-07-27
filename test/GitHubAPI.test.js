jest.mock('../src/Config', () => ({
  getToken: () => Promise.resolve('abc')
}));

import API from '../src/GitHubAPI';
import jestFetchMock from 'jest-fetch-mock';

global.fetch = jestFetchMock;

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
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(fetch.mock.calls[0][0]).toEqual(`${API.baseURI}/user`);
    done();
  });
});