jest.mock('../../src/Config', () => ({
  baseURI: 'https://api.github.com',
  getToken: () => Promise.resolve('abc')
}));

import Config from '../../src/Config';
import ghFetch from '../../src/github/ghFetch';
import jestFetchMock from 'jest-fetch-mock';

global.fetch = jestFetchMock;

describe('testing fetch', () => {
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

    ghFetch('/user').then((res) => {
      expect(res.body).toEqual(internalBody);
      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(fetch.mock.calls[0][0]).toEqual(`${Config.baseURI}/user`);
      expect(fetch.mock.calls[0][1]).toEqual({
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'token abc',
        }
      });
      done();
    });
  });
});