const init = function (bg) {
  const btOptions = document.getElementById('bt-options');
  btOptions.addEventListener('click', _openOptionsPage);
};

const _openOptionsPage = function () {
  chrome.runtime.openOptionsPage();
};

document.addEventListener('DOMContentLoaded', function () {
  chrome.runtime.getBackgroundPage(init);
});