import Fuse from 'fuse.js';
import {flatten} from 'ramda';
import GitHub from './GitHub';
import Storage from './Storage';

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

    if (_currOpt[OPT_BADGE]) {
      if (color) {
        chrome.browserAction.setBadgeBackgroundColor(color);
      }
      chrome.browserAction.setBadgeText({text: textStr});
    }
  };

  const findRepo = async function (text, suggest) {
    const repos = flatten(Object.values(await GitHub.getAllSavedRepos()));
    const fuse = new Fuse(repos, {keys: [{name: 'fullName', weight: 1}]});
    const result = fuse.search(text).map((repo) => ({content: `${repo.fullName} `, description: repo.fullName}));
    suggest(result);
  };

  const buildActionStr = async function (actionName, optionalFilter) {
    if (!actionName) {
      const defaultAction = await Storage.get({defaultAction: ''});
      return defaultAction && `/${defaultAction}`;
    }

    const savedActions = (await Storage.get({actions: defaultActions})).actions;
    const {action, filter: defaultFilter} = savedActions[actionName];
    const filter = optionalFilter || defaultFilter;

    if (!filter) return `/${action}`;

    return `/${action}?utf8=%E2%9C%93&q=${filter.replace(' ', '+')}`;
  };

  const handleEnteredText = async function (text) {
    const parts = text.split(' ');
    const [repoSource, repoName] = parts[0].split('/');
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