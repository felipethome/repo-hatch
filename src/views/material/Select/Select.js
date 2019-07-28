/**
 * author: Felipe Thome
 * 2017
 */

import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import classes from './Select.css';

export default class Select extends React.Component {
  static displayName = 'Select';

  static propTypes = {
    addEmptyOption: PropTypes.bool,
    children: PropTypes.any,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    label: PropTypes.string,
    name: PropTypes.string,
    onChange: PropTypes.func,
    required: PropTypes.bool,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  };

  _handleChange = (event) => {
    const value = event.target.value;

    if (this.props.onChange) {
      this.props.onChange(event, this.props.name, value);
    }
  };

  render() {
    const {
      addEmptyOption,
      children,
      className,
      disabled,
      label,
      name,
      required,
      value,
    } = this.props;

    let labelElem;
    let requiredElem;

    if (label) {
      if (required) {
        requiredElem = (
          <span
            className={cn(classes.required, value && classes.requiredWithValue)}
          >
            {'*'}
          </span>
        );
      }

      labelElem = (
        <label
          htmlFor={this._id}
          className={cn(classes.label, value && classes.floatingLabel)}
        >
          {label}{requiredElem}
        </label>
      );
    }

    return (
      <div className={cn(classes.container, className)}>
        <select
          className={classes.selectField}
          disabled={disabled}
          name={name}
          value={value}
          onChange={this._handleChange}
        >
          {addEmptyOption ? <option disabled /> : null}
          {children}
        </select>
        {labelElem}
        <div className={classes.bar} />
      </div>
    );
  }
}