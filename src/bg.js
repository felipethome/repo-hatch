import config from './Config';
import Storage from './Storage';

const BgCtrl = (function () {
  const OPT_TEXT = 'text';
  const OPT_NOTIFICATION = 'enableNotifications';
  const OPT_BADGE = 'showBadge';
  const OPT_LOCAL_OPTIONS = 'localOptions';
  const OPT_FILE_NAME = 'fileName';
  const OPT_FILE_DATA = 'data';

  const NOTIFICATION_ICON = 'img/icon.png';

  let _options;
  let _currOpt;

  const getDefaultOptions = function () {
    const defaultOptions = {};

    defaultOptions[OPT_TEXT] = '-';
    defaultOptions[OPT_NOTIFICATION] = false;
    defaultOptions[OPT_BADGE] = false;

    return defaultOptions;
  };

  const getDefaultLocalOptions = function () {
    return [OPT_FILE_NAME, OPT_FILE_DATA];
  };

  const _cloneOptions = function (options) {
    const optionsClone = {};

    optionsClone[OPT_TEXT] = options[OPT_TEXT];
    optionsClone[OPT_NOTIFICATION] = options[OPT_NOTIFICATION];
    optionsClone[OPT_BADGE] = options[OPT_BADGE];

    if (options[OPT_LOCAL_OPTIONS]) {
      const localOptionsClone = {};
      const localOptions = options[OPT_LOCAL_OPTIONS];

      localOptionsClone[OPT_FILE_NAME] = localOptions[OPT_FILE_NAME];
      localOptionsClone[OPT_FILE_DATA] = localOptions[OPT_FILE_DATA];
      optionsClone[OPT_LOCAL_OPTIONS] = localOptionsClone;
    }

    return optionsClone;
  };

  const getOptions = function () {
    return _cloneOptions(_options);
  };

  const saveOptions = function (options) {
    // Make a shallow copy before changing the object structure.
    _options = Object.assign({}, options);

    // Save some options in the local storage because they are just too big.
    if (options[OPT_LOCAL_OPTIONS]) {
      const localOptions = options[OPT_LOCAL_OPTIONS];
      delete options[OPT_LOCAL_OPTIONS];
      chrome.storage.local.set(localOptions, function () {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError);
        }
      });
    }

    // Options that will be synchronized across devices.
    chrome.storage.sync.set(options, function () {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
      }
    });
  };

  const _setInternalData = function (options) {
    _options = options ? options : _options;
    _currOpt = _cloneOptions(_options);
  };

  const init = function (options) {
    _setInternalData(options);
  };

  const update = function (msg) {
    console.log(msg);
  };

  const _showNotification = function (notificationOptions) {
    if (_currOpt[OPT_NOTIFICATION]) {
      chrome.notifications.create(notificationOptions);
    }
  };

  const _updateBadge = function (text, color = {color: '#B71C1C'}) {
    let textStr = text;
    if (typeof textStr !== 'string') textStr = textStr.toString();

    if (_currOpt[OPT_BADGE]) {
      if (color) {
        chrome.browserAction.setBadgeBackgroundColor(color);
      }
      chrome.browserAction.setBadgeText({
        text: textStr,
      });
    }
  };

  const baseURI = 'https://api.github.com/';

  // https://github.com/github-tools/github/blob/master/lib/Requestable.js
  const getNextPage = function (linksHeader = '') {
    const links = linksHeader.split(/\s*,\s*/); // splits and strips the urls
    return links.reduce(function(nextUrl, link) {
       if (link.search(/rel="next"/) !== -1) {
          return (link.match(/<(.*)>/) || [])[1];
       }
 
       return nextUrl;
    }, undefined);
 }

  const ghFetch = function (path, options = {}, fullPath = false) {
    const token = config.token;
    const opt = Object.assign({}, options);
    opt.headers = Object.assign({
      'Content-Type': 'application/json',
      'Authorization': `token ${token}`,
    }, options.headers);

    const response = {};

    return fetch(`${fullPath ? '' : baseURI}${path}`, opt)
      .then((r) => {
        response.headers = r.headers;
        response.status = r.status;
        return r.json();
      })
      .then((json) => {
        response.body = json;
        return response;
      });
  };

  const getAllPages = async function (link, result = []) {
    if (!link) return result;
    const curr = await ghFetch(link, {}, true);
    const nextLink = getNextPage(curr.headers.get('Link'));
    result.push(curr);
    return getAllPages(nextLink, result);
  };

  const getAllOrgs = function () {
    return ghFetch('user/orgs');
  };

  const getAllOrgRepos = async function (orgName) {
    const repos = await getAllPages(`${baseURI}orgs/${orgName}/repos?per_page=100`);
  };

  return {
    init,
    update,
    getDefaultOptions,
    getDefaultLocalOptions,
    getOptions,
    saveOptions,
    getAllOrgs,
    getAllOrgRepos,
  };
})();

(function () {
  let options = {};

  // Notice the Storage promises will never be rejected.
  Storage.get(BgCtrl.getDefaultOptions(), 'sync')
    .then(function (syncOptions) {
      options = syncOptions;
      return Storage.get(BgCtrl.getDefaultLocalOptions(), 'local');
    })
    .then(function (localOptions) {
      options.localOptions = localOptions;
      return Storage.get('statsIds', 'local');
    })
    .then(function () {
      BgCtrl.init(options);

      chrome.runtime.onConnect.addListener(function (port) {
        const COMMUNICATION_CHANNEL = 'comm-channel';
        if (port.name !== COMMUNICATION_CHANNEL) return;

        port.onMessage.addListener(function (msg) {
          msg.id = port.sender.tab.id;
          msg.windowId = port.sender.tab.windowId;
          BgCtrl.update(msg);
        });
      });
    });
})();

window.BgCtrl = BgCtrl;