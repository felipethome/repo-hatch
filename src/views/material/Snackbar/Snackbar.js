/**
 * author: Felipe Thome
 * 2017
 */

import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import CircularIndicator from '../CircularIndicator/Indeterminate';

import classes from './Snackbar.css';

export default class Snackbar extends React.Component {
  static displayName = 'Snackbar';

  static propTypes = {
    action: PropTypes.any,
    loading: PropTypes.bool,
    message: PropTypes.string,
    onActionClick: PropTypes.func,
    show: PropTypes.bool,
  };

  render() {
    const {loading, message, show} = this.props;

    let actionElem;

    if (loading) {
      actionElem = (
        <div className={classes.progressIndicator}>
          <CircularIndicator />
        </div>
      );
    }
    else if (this.props.action) {
      actionElem = (
        <div
          className={classes.action}
          onClick={this.props.onActionClick}
        >
          {this.props.action}
        </div>
      );
    }

    return (
      <div className={cn(classes.snackbar, show && classes.snackbarVisible)}>
        {message}{actionElem}
      </div>
    );
  }
}