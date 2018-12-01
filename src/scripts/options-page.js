const Options = (function () {
  const OPT_TEXT = 'text';
  const OPT_NOTIFICATION = 'enableNotifications';
  const OPT_BADGE = 'showBadge';
  const OPT_LOCAL_OPTIONS = 'localOptions';
  const OPT_FILE_NAME = 'fileName';
  const OPT_FILE_DATA_URL = 'data';

  // 500 KB
  const FILE_SIZE = 512000;

  const TIMEOUT_SAVED_TEXT = 2500;

  const Bg;

  const init = function (backgroundPage) {
    Bg = backgroundPage.BgCtrl;

    _localize();
    _addListeners();
    _restoreOptions();
  };

  const _localize = function () {
    // const getById = document.getElementById.bind(document);
    // const _ = chrome.i18n.getMessage.bind(chrome.i18n);
  };

  const _addListeners = function () {
    const getById = document.getElementById.bind(document);
    const _ = chrome.i18n.getMessage.bind(chrome.i18n);

    getById("bt-save").addEventListener('click', _saveTextFields);

    getById("notification").addEventListener('change', function () {
      const options = Bg.getOptions();
      options[OPT_NOTIFICATION] = this.checked;
      Bg.saveOptions(options);
    });

    getById("badge").addEventListener('change', function () {
      const options = Bg.getOptions();
      options[OPT_BADGE] = this.checked;
      Bg.saveOptions(options);
    });

    getById("file").addEventListener('change', function () {
      const file = getById('file').files[0];

      if (!file) return;
      if (file.size > FILE_SIZE) {
        window.alert('Too large.');
        return;
      }

      const filePathTextField = getById('file-name');
      filePathTextField.value = file !== undefined ? file.name : '';

      const fileReader = new FileReader();
      const fileName = file.name;

      fileReader.readAsDataURL(file);

      // Save the file in the local options (local storage is larger than sync storage).
      fileReader.onload = function () {
        const options = Bg.getOptions();
        if (!options[OPT_LOCAL_OPTIONS]) options[OPT_LOCAL_OPTIONS] = {};

        options[OPT_LOCAL_OPTIONS][OPT_FILE_NAME] = fileName;
        options[OPT_LOCAL_OPTIONS][OPT_FILE_DATA_URL] = this.result;
        Bg.saveOptions(options);
      };

      fileReader.onerror = function (error) {
        console.error(error);
      };
    });
  };

  const _showSavedText = function (elemId) {
    document.getElementById(elemId).style.display = 'inline';

    setTimeout(function () {
      document.getElementById(elemId).style.display = 'none';
    }, TIMEOUT_SAVED_TEXT);
  };

  const _saveTextFields = function () {
    const text = getById('text-field').value;
    const options = Bg.getOptions();
  
    options[OPT_TEXT] = text || options[OPT_TEXT];

    Bg.saveOptions(options);
    _showSavedText('saved-text');
  };

  const _restoreOptions = function () {
    const getById = document.getElementById.bind(document);
    const options = Bg.getOptions();

    getById('text-field').value = options[OPT_TEXT].toString();
    getById('notification').checked = options[OPT_NOTIFICATION];
    getById('badge').checked = options[OPT_BADGE];

    if (options[OPT_LOCAL_OPTIONS]) {
      const localOptions = options[OPT_LOCAL_OPTIONS];
      getById('file-name').value =
        localOptions[OPT_FILE_NAME] ? localOptions[OPT_FILE_NAME] : '';
    }
  };

  return {
    init,
  };
})();

document.addEventListener('DOMContentLoaded', function () {
  chrome.runtime.getBackgroundPage(Options.init);
});