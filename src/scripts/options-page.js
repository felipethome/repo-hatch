var Options = (function () {
  var OPT_1 = 'opt-1';
  const OPT_2 = 'opt-2';
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

    getById("toggle-1").addEventListener('change', function () {
      const options = Bg.getOptions();
      options[OPT_2] = this.checked;
      Bg.saveOptions(options);
    });

    getById("toggle-2").addEventListener('change', function () {
      const options = Bg.getOptions();
      options[OPT_3] = this.checked;
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
  
    options[OPT_1] = text || options[OPT_TIME];

    Bg.saveOptions(options);
    _showSavedText('saved-text');
  };

  const _restoreOptions = function () {
    const getById = document.getElementById.bind(document);
    const options = Bg.getOptions();

    getById('text-field').value = options[OPT_1].toString();
    getById('toggle-1').checked = options[OPT_2];
    getById('toggle-2').checked = options[OPT_3];

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