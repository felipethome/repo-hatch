import React from 'react';
import PropTypes from 'prop-types';
import IconButton from '../IconButton';
import CloseIcon from '../icons/navigation/close';

import classes from './Dialog.css';

export default class Dialog extends React.Component {
  static displayName = 'Dialog';

  static propTypes = {
    actions: PropTypes.any,
    children: PropTypes.any,
    onClose: PropTypes.func,
    show: PropTypes.bool,
    title: PropTypes.any,
  };

  render() {
    const {
      actions,
      children,
      onClose,
      show,
      title,
      ...userProps
    } = this.props;

    let containerStyle;

    if (!show) {
      containerStyle = {
        display: 'none',
      };
    }

    let actionsElem;

    if (actions) {
      actionsElem = (<div className={classes.actions}>{actions}</div>);
    }

    return (
      <div {...userProps} className={classes.container} style={containerStyle}>
        <div className={classes.closeButtonContainer}>
          <IconButton onClick={onClose}>
            <CloseIcon className={classes.closeIcon} />
          </IconButton>
        </div>
        <div className={classes.backdrop} onClick={onClose} />
        <div className={classes.dialog}>
          <div className={classes.title}>{title}</div>
          {children}
          {actionsElem}
        </div>
      </div>
    );
  }
}