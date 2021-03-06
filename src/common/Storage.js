// Don't call reject if something went wrong when getting or setting items
// to not break the promise chain.
const Storage = (function () {
  const get = function (keys, area) {
    return new Promise((resolve) => {
      if (area === 'sync') {
        chrome.storage.sync.get(keys, (items) => {
          if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
            resolve({});
          }
          else resolve(items);
        });
      }
      else {
        chrome.storage.local.get(keys, (items) => {
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
    return new Promise((resolve) => {
      if (area === 'sync') {
        chrome.storage.sync.set(keys, () => {
          if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
            resolve({});
          }
          else resolve();
        });
      }
      else {
        chrome.storage.local.set(keys, () => {
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
    return new Promise((resolve) => {
      if (area === 'sync') {
        chrome.storage.sync.remove(keys, () => {
          if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
            resolve({});
          }
          else resolve();
        });
      }
      else {
        chrome.storage.local.remove(keys, () => {
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

export default Storage;