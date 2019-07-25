import Storage from './Storage';

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

  return {
    updateBadge,
  };
})();

window.Bg = Bg;