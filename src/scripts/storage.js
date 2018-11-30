// Don't call reject if something went wrong when getting or setting items
// to not break the promise chain.
const Storage = (function () {
  const get = function (keys, area) {
    return new Promise(function (resolve) {
      if (area === 'sync') {
        chrome.storage.sync.get(keys, function (items) {
          if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
            resolve({});
          }
          else resolve(items);
        });
      }
      else {
        chrome.storage.local.get(keys, function (items) {
          if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
            resolve({});
          }
          else resolve(items);
        });
      }
    });
  };

  const set = function (keys, area) {
    return new Promise(function (resolve) {
      if (area === 'sync') {
        chrome.storage.sync.set(keys, function () {
          if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
            resolve({});
          }
          else resolve();
        });
      }
      else {
        chrome.storage.local.set(keys, function () {
          if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
            resolve({});
          }
          else resolve();
        });
      }
    });
  };

  const remove = function (keys, area) {
    return new Promise(function (resolve) {
      if (area === 'sync') {
        chrome.storage.sync.remove(keys, function () {
          if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
            resolve({});
          }
          else resolve();
        });
      }
      else {
        chrome.storage.local.remove(keys, function () {
          if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
            resolve({});
          }
          else resolve();
        });
      }
    });
  };

  return {
    get,
    set,
    remove,
  };
})();