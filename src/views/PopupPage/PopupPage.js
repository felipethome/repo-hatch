import React from 'react';
import RaisedButton from '../material/RaisedButton';

import classes from './PopupPage.css';

export default class PopupPage extends React.Component {
  handleOptionsButtonClick = () => {
    chrome.runtime.openOptionsPage();
  };

  render() {
    return (
      <div className={classes.container}>
        <RaisedButton onClick={this.handleOptionsButtonClick}>Options</RaisedButton>
      </div>
    );
  }
}
