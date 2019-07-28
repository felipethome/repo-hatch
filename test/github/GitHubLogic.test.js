import uuidv4 from 'uuid/v4';
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

  it('correctly builds the action part of the url', () => {
    const actionStr = GitHubLogic.buildActionStr({
      actionName: 'p',
      optionalFilter: 'author:felipethome',
      defaultAction: '',
      savedActions: [{id: uuidv4(), name: 'p', action: 'pulls'}],
    });

    expect(actionStr).toEqual('/pulls?utf8=%E2%9C%93&q=author:felipethome');
  });

  it('correctly builds the action part of the url when there is no action', () => {
    const actionStr = GitHubLogic.buildActionStr({
      actionName: '',
      optionalFilter: 'author:felipethome',
      defaultAction: '',
      savedActions: [{id: uuidv4(), name: 'p', action: 'pulls'}],
    });

    expect(actionStr).toEqual('');
  });

  it('correctly builds the action part of the url using the default action', () => {
    const actionStr = GitHubLogic.buildActionStr({
      actionName: '',
      optionalFilter: '',
      defaultAction: 'pulls',
      savedActions: [{id: uuidv4(), name: 'p', action: 'pulls'}],
    });

    expect(actionStr).toEqual('/pulls');
  });

  it('correctly builds the action part of the url without filter', () => {
    const actionStr = GitHubLogic.buildActionStr({
      actionName: 'p',
      optionalFilter: '',
      defaultAction: '',
      savedActions: [{id: uuidv4(), name: 'p', action: 'pulls'}],
    });

    expect(actionStr).toEqual('/pulls');
  });

  it('correctly builds the action part of the url with a composed filter', () => {
    const actionStr = GitHubLogic.buildActionStr({
      actionName: 'p',
      optionalFilter: 'is:pr author:felipethome',
      defaultAction: '',
      savedActions: [{id: uuidv4(), name: 'p', action: 'pulls'}],
    });

    expect(actionStr).toEqual('/pulls?utf8=%E2%9C%93&q=is:pr+author:felipethome');
  });

  it('correctly builds the action part of the url with the chosen filter', () => {
    const actionStr = GitHubLogic.buildActionStr({
      actionName: 'p',
      optionalFilter: 'is:pr',
      defaultAction: '',
      savedActions: [{id: uuidv4(), name: 'p', action: 'pulls', filter: 'author:felipethome'}],
    });

    expect(actionStr).toEqual('/pulls?utf8=%E2%9C%93&q=is:pr');
  });

  it('correctly builds the action part of the url with the predefined filter', () => {
    const actionStr = GitHubLogic.buildActionStr({
      actionName: 'p',
      optionalFilter: '',
      defaultAction: '',
      savedActions: [{id: uuidv4(), name: 'p', action: 'pulls', filter: 'author:felipethome'}],
    });

    expect(actionStr).toEqual('/pulls?utf8=%E2%9C%93&q=author:felipethome');
  });
});