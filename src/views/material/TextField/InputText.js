import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import classes from './InputText.css';

export default class InputText extends React.Component {
  static displayName = 'InputText';

  static propTypes = {
    autoFocus: PropTypes.bool,
    defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    disabled: PropTypes.bool,
    floatingLabel: PropTypes.bool,
    focused: PropTypes.bool,
    invalid: PropTypes.bool,
    label: PropTypes.string,
    maxLength: PropTypes.number,
    name: PropTypes.string,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    placeholder: PropTypes.string,
    required: PropTypes.bool,
    showBar: PropTypes.bool,
    tabIndex: PropTypes.string,
    type: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  };

  constructor(props) {
    super(props);
  }

  render() {
    const {
      autoFocus,
      defaultValue,
      disabled,
      floatingLabel,
      focused,
      invalid,
      label,
      maxLength,
      name,
      onBlur,
      onChange,
      onFocus,
      placeholder,
      required,
      showBar,
      type,
      value,
      ...userProps
    } = this.props;

    let labelElem;
    let requiredElem;
    let barElem;

    if (label) {
      if (required) {
        requiredElem = (
          <span
            className={cn(
              classes.required,
              focused && classes.requiredFocus,
              !floatingLabel && classes.requiredFocus,
              invalid && classes.requiredInvalid,
              disabled && classes.requiredDisabled
            )}
          >
            {'*'}
          </span>
        );
      }

      labelElem = (
        <label
          className={cn(
            classes.label,
            focused && classes.labelFocus,
            !floatingLabel && classes.labelFocus,
            invalid && classes.labelInvalid,
            disabled && classes.labelDisabled
          )}
        >
          {label}{requiredElem}
        </label>
      );
    }

    if (showBar) {
      barElem = (
        <span
          className={cn(
            classes.bar,
            focused && classes.barFocus,
            invalid && classes.barInvalid
          )}
        />
      );
    }

    return (
      <div className={classes.container}>
        {labelElem}
        <input
          {...userProps}
          autoFocus={autoFocus}
          defaultValue={defaultValue}
          disabled={disabled}
          maxLength={maxLength}
          name={name}
          placeholder={placeholder}
          onBlur={onBlur}
          onChange={onChange}
          onFocus={onFocus}
          className={cn(
            classes.input,
            invalid && classes.inputInvalid,
            disabled && classes.inputDisabled
          )}
          tabIndex={this.props.tabIndex}
          type={type}
          value={value}
        />
        {barElem}
      </div>
    );
  }
}