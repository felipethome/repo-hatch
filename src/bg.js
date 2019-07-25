import Fuse from 'fuse.js';
import {flatten} from 'ramda';
import GitHub from './GitHub';

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
    const result = fuse.search(text).map((repo) => ({content: repo.name, description: repo.fullName}));
    suggest(result);
  };

  const handleEnteredText = function (text) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      var activeTab = tabs[0];
      chrome.tabs.update(activeTab.id, {url: `https://github.com/nubank/${text}`});
    });
  };

  return {
    updateBadge,
    findRepo,
    handleEnteredText,
  };
})();

window.Bg = Bg;

chrome.omnibox.setDefaultSuggestion({description: 'Type the name of a repository'})
chrome.omnibox.onInputChanged.addListener(Bg.findRepo);
chrome.omnibox.onInputEntered.addListener(Bg.handleEnteredText);