import Storage from './Storage';
import GitHub from './GitHub';

const Bg = (function () {
  let options;

  const getDefaultOptions = function () {
    return {
      profile: {},
      orgs: {},
      repos: {},
    };
  };

  const init = function (opt) {
    options = opt;
  };

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

  return {
    init,
    getDefaultOptions,
    updateBadge,
  };
})();

window.Bg = Bg;

Storage.get(Bg.getDefaultOptions(), 'sync')
  .then((options) => Bg.init(options));