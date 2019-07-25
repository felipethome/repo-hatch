import React from 'react';
import PropTypes from 'prop-types';
import Snackbar from './Snackbar';
import CloseIcon from '../icons/navigation/close.js';

import classes from './SnackbarWrapper.css';

export default class SnackbarWrapper extends React.Component {
  static displayName = 'SnackbarWrapper';

  static propTypes = {
    canDismiss: PropTypes.bool,
    onActionClick: PropTypes.func,
    onTimeout: PropTypes.func,
    timeout: PropTypes.number,
  };

  state = {
    action: '',
    message: '',
    show: false,
  };

  componentWillUnmount() {
    clearTimeout(this._timeoutId);
  }

  show = (message, action = null) => {
    clearTimeout(this._timeoutId);

    this.setState(() => ({
      action: action,
      message: message,
      show: true,
    }), () => {
      if (this.props.timeout !== undefined) {
        this._timeoutId = setTimeout(() => {
          if (this.props.onTimeout) this.props.onTimeout();
          this.dismiss();
        }, this.props.timeout);
      }
    });
  };

  dismiss = () => {
    clearTimeout(this._timeoutId);
    this.setState(() => ({show: false}));
  };

  _handleActionClick = () => {
    if (this.props.canDismiss) {
      this.dismiss();
    }

    if (this.props.onActionClick) {
      this.props.onActionClick();
    }
  };

  render() {
    let action = this.state.action;

    if (this.props.canDismiss) {
      action = (<CloseIcon className={classes.icon} />);
    }

    return (
      <Snackbar
        action={action}
        message={this.state.message}
        onActionClick={this._handleActionClick}
        show={this.state.show}
      />
    );
  }
}