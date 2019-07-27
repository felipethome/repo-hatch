import GitHubLogic from '../../src/github/GitHubLogic';

describe('github logic', () => {
  it('gets next page when available', () => {
    const link = `<https://api.github.com/user/repos?page=3&per_page=100>; rel="next",
      <https://api.github.com/user/repos?page=50&per_page=100>; rel="last"`;
    const nextPage = GitHubLogic.getNextPage(link);
    expect(nextPage).toEqual('https://api.github.com/user/repos?page=3&per_page=100');
  });

  it('returns undefined when there is no next page', () => {
    const link = '<https://api.github.com/user/repos?page=40&per_page=100>; rel="previous"';
    const nextPage = GitHubLogic.getNextPage(link);
    expect(nextPage).toEqual(undefined);
  });
});