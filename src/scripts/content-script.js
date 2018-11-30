const Checker = (function () {
  const COMMUNICATION_CHANNEL = 'comm-channel';
  const _port = chrome.runtime.connect({name: COMMUNICATION_CHANNEL});

  const sendMsg = function (msg) {
    _port.postMessage(msg);
  };

  return {
    sendMsg,
  };
})();

Checker.sendMsg('Hi from content script!');