/**
 * author: Felipe Thome
 */

import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import CheckMarkIcon from '../icons/navigation/check';
import DashMarkIcon from '../icons/content/remove';

import classes from './Checkbox.css';

export default class Checkbox extends React.Component {
  static displayName = 'Checkbox';

  static propTypes = {
    /**
     * @ignore
     */
    checked: PropTypes.bool,
    /**
     * @ignore
     */
    indeterminate: PropTypes.bool,
    /**
     * @ignore
     */
    name: PropTypes.string,
    /**
     * @ignore
     */
    onChange: PropTypes.func,
    /**
     * @ignore
     */
    style: PropTypes.object,
  };

  _setIndeterminate = (indeterminate) => {
    if (this._hiddenCheckbox) {
      this._hiddenCheckbox.indeterminate = indeterminate;
    }
  };

  render() {
    const {
      checked,
      indeterminate,
      name,
      onChange,
      style,
      ...userProps
    } = this.props;

    const isChecked = checked || indeterminate;

    this._setIndeterminate(indeterminate);

    let icon;
    if (indeterminate) {
      icon = (<DashMarkIcon className={classes.icon} />);
    }
    else if (checked) {
      icon = (<CheckMarkIcon className={classes.icon} />);
    }

    return (
      <div className={classes.container} style={style}>
        <div className={classes.unchecked} />
        <div
          className={cn(classes.checked, isChecked && classes.checkedAppear)}
        >
          {icon}
        </div>
        <input
          {...userProps}
          type="checkbox"
          name={name}
          checked={checked}
          onChange={onChange}
          ref={(elem) => {
            this._hiddenCheckbox = elem;
            this._setIndeterminate(indeterminate);
          }}
          className={classes.hiddenCheckbox}
        />
      </div>
    );
  }
}