import fuzzysort from 'fuzzysort';
import {flatten} from 'ramda';
import GitHub from './github/GitHub';
import GitHubLogic from './github/GitHubLogic';
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

  const handleEnteredText = async function (text) {
    const parts = text.split(' ');
    const repoFullName = await GitHubLogic.buildRepoFullName({
      repo: parts[0],
      defaultRepoSource: (await GitHub.getDefaultRepoSource()),
    });
    const [repoSource, repoName] = repoFullName.split('/');
    const actionStr = await GitHubLogic.buildActionStr({
      actionName: parts[1],
      optionalFilter: parts[2],
      defaultAction: (await Storage.get({defaultAction: ''})).defaultAction,
      savedActions: (await Storage.get({actions: defaultActions})).actions,
    });

    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      const activeTab = tabs[0];
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