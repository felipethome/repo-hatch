import fuzzysort from 'fuzzysort';
import {flatten} from 'ramda';
import GitHub from './github/GitHub';
import Storage from './common/Storage';

const defaultActions = {
  p: {action: 'pulls'},
  i: {action: 'issues'},
  t: {action: 'find/master'},
  s: {action: 'search'},
};

const Bg = (function () {
  const updateBadge = function (text, color = {color: '#4CAF50'}) {
    let textStr = text;
    if (typeof textStr !== 'string') textStr = textStr.toString();

    if (color) {
      chrome.browserAction.setBadgeBackgroundColor(color);
    }
    chrome.browserAction.setBadgeText({text: textStr});
  };

  const findRepo = async function (text, suggest) {
    const repos = flatten(Object.values(await GitHub.getAllSavedRepos()));
    const result = fuzzysort.go(text, repos, {key: 'fullName'}).map((repo) => (
      {content: `${repo.obj.fullName} `, description: repo.obj.fullName}
    ));
    suggest(result);
  };

  const buildActionStr = async function (actionName, optionalFilter) {
    if (!actionName) {
      const defaultAction = (await Storage.get({defaultAction: ''})).defaultAction;
      return defaultAction && `/${defaultAction}`;
    }

    const savedActions = (await Storage.get({actions: defaultActions})).actions;
    const {action, filter: defaultFilter} = savedActions[actionName];
    const filter = optionalFilter || defaultFilter;

    if (!filter) return `/${action}`;

    return `/${action}?utf8=%E2%9C%93&q=${filter.replace(' ', '+')}`;
  };

  const getDefaultRepoSource = async function () {
    const savedOptions = await Storage.get({defaults: {}, user: {}});
    return savedOptions.defaults.defaultRepoSource || savedOptions.user.login;
  };

  const buildRepoFullName = async function (repo) {
    return repo.includes('/') ? repo : `${(await getDefaultRepoSource())}/${repo}`;
  };

  const handleEnteredText = async function (text) {
    const parts = text.split(' ');
    const repoFullName = await buildRepoFullName(parts[0]);
    const [repoSource, repoName] = repoFullName.split('/');
    const actionStr = await buildActionStr(parts[1], parts[2]);

    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      var activeTab = tabs[0];
      chrome.tabs.update(activeTab.id, {
        url: `https://github.com/${repoSource}/${repoName}${actionStr}`,
      });
    });
  };

  return {
    updateBadge,
    findRepo,
    handleEnteredText,
  };
})();

window.Bg = Bg;

chrome.omnibox.onInputChanged.addListener(Bg.findRepo);
chrome.omnibox.onInputEntered.addListener(Bg.handleEnteredText);