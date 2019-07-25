import React from 'react';
import ReactDOM from 'react-dom';
import OptionsPage from './OptionsPage';

// Common/Global CSS.
import '../styles/base.css';
import '../styles/colors.css';
import '../styles/shadows.css';
import '../styles/materialCurves.css';

const mount = function (backgroundPageWindow) {
  ReactDOM.render(
    <OptionsPage bg={backgroundPageWindow.Bg} />,
    document.getElementById('container')
  );
};

chrome.runtime.getBackgroundPage(mount);