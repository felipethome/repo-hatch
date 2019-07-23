import React from 'react';
import ReactDOM from 'react-dom';
import OptionsPage from './OptionsPage';

const mount = function (backgroundPageWindow) {
  ReactDOM.render(
    <OptionsPage bg={backgroundPageWindow.Bg} />,
    document.getElementById('container')
  );
};

chrome.runtime.getBackgroundPage(mount);