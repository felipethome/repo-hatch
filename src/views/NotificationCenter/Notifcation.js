import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import CloseIcon from '../material/icons/navigation/close';
import IconButton from '../material/IconButton';

import classes from './NotificationCenter.css';

export default class Notification extends React.Component {
  static propTypes = {
    id: PropTypes.any,
    message: PropTypes.any,
    onClose: PropTypes.func,
    timeout: PropTypes.number,
    type: PropTypes.string,
  };

  componentDidMount() {
    const {onClose, timeout} = this.props;
    if (timeout) this.timeoutId = window.setTimeout(onClose, timeout);
  }

  componentWillUnmount() {
    if (this.timeoutId) window.clearTimeout(this.timeoutId);
  }

  render() {
    const {message, onClose, type} = this.props;

    return (
      <div
        className={cn(
          classes.notification,
          type === 'success' && classes.success,
          type === 'fail' && classes.fail,
          (type === 'info' || !type) && classes.info
        )}
      >
        {message}
        <IconButton onClick={onClose}>
          <CloseIcon className={classes.closeIcon} />
        </IconButton>
      </div>
    );
  }
}
