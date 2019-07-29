import fuzzysort from 'fuzzysort';
import {flatten} from 'ramda';
import GitHub from './github/GitHub';
import GitHubLogic from './github/GitHubLogic';

const Bg = (function () {
  const updateBadge = function (text, color = {color: '#4CAF50'}) {
    let textStr = text;
    if (typeof textStr !== 'string') textStr = textStr.toString();

    if (color) {
      chrome.browserAction.setBadgeBackgroundColor(color);
    }
    chrome.browserAction.setBadgeText({text: textStr});
  };

  const getFlattenedReposVector = async function () {
    return flatten(Object.values(await GitHub.getAllSavedRepos()));
  };

  const findRepo = function ({text, allReposVector}) {
    return fuzzysort.go(text, allReposVector, {key: 'fullName'});
  };

  const toSuggestion = function (repo) {
    return {content: `${repo.obj.fullName} `, description: repo.obj.fullName};
  };

  const handleTextChanged = async function (text, suggest) {
    const result = findRepo({
      text,
      allReposVector: (await getFlattenedReposVector()),
    }).map(toSuggestion);

    suggest(result);
  };

  const repoExists = function ({repoFullName, allReposVector}) {
    return allReposVector.find((curr) => curr.fullName === repoFullName);
  };

  const handleEnteredText = async function (text) {
    const [enteredRepoName, actionName, optionalFilter] = text.split(' ');
    const allReposVector = await getFlattenedReposVector();
    const repoFullName = (allReposVector.length === 0 || repoExists({repoFullName: enteredRepoName, allReposVector})) ?
      enteredRepoName : findRepo({text: enteredRepoName, allReposVector})[0].obj.fullName;
    const [repoSource, repoName] = repoFullName.split('/');
    const actionStr = await GitHubLogic.buildActionStr({
      actionName,
      optionalFilter,
      defaultAction: (await GitHub.getDefaultAction()),
      savedActions: (await GitHub.getSavedActions()),
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
    handleTextChanged,
    handleEnteredText,
  };
})();

window.Bg = Bg;

chrome.browserAction.onClicked.addListener(() => {
  chrome.runtime.openOptionsPage();
});

GitHub.getToken().then((token) => {
  if (!token) Bg.updateBadge('!');
});

chrome.omnibox.onInputChanged.addListener(Bg.handleTextChanged);
chrome.omnibox.onInputEntered.addListener(Bg.handleEnteredText);