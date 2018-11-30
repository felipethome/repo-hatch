const Popup = (function () {
  const init = function (bg) {
    document.getElementById('bt-options')
      .addEventListener('click', _openOptionsPage);
  };

  const _openOptionsPage = function () {
    chrome.runtime.openOptionsPage();
  };

  return {
    init,
  };
})();

document.addEventListener('DOMContentLoaded', function () {
  chrome.runtime.getBackgroundPage(Popup.init);
});