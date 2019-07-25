import React from 'react';
import PropTypes from 'prop-types';
import InputText from './InputText';
import cn from 'classnames';

import classes from './TextField.css';

export default class TextField extends React.Component {
  static displayName = 'TextField';

  static propTypes = {
    /**
     * If true, the text field will have focus when rendered for the first time.
     */
    autoFocus: PropTypes.bool,
    /**
     * The default value of the text field presents a value to the user when the
     * component is rendered for the first time and makes it uncontrolled.
     */
    defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    /**
     * If true, the text field is disabled and the user can not interact with
     * it.
     */
    disabled: PropTypes.bool,
    /**
     * When the property invalid is true the error message will be shown under
     * the text field.
     */
    errorMessage: PropTypes.string,
    /**
     * If true, the text field has an animated label.
     */
    floatingLabel: PropTypes.bool,
    /**
     * When content of this property will be shown as a helper/description text
     * to the user under the text field.
     */
    helperText: PropTypes.string,
    /**
     * If true, the text field is considered to be in error state and the error
     * message will be shown.
     */
    invalid: PropTypes.bool,
    /**
     * The label of the text field.
     */
    label: PropTypes.string,
    /**
     * The max length of the text field in numbers of characters.
     */
    maxLength: PropTypes.number,
    /**
     * This will act like the name attribute of a HTML input text.
     */
    name: PropTypes.string,
    /**
     * @ignore
     */
    onBlur: PropTypes.func,
    /**
     * @ignore
     */
    onChange: PropTypes.func,
    /**
     * @ignore
     */
    onFocus: PropTypes.func,
    /**
     * If true the text field will be considered required for a HTML5 form and
     * will present an asterisk on the right of the label.
     */
    required: PropTypes.bool,
    /**
     * If true, the bar under the text field will be animated when focusing.
     */
    showBar: PropTypes.bool,
    /**
     * If true, the text field will show a counter of the characters together
     * with the maxLength property.
     */
    showCounter: PropTypes.bool,
    /**
     * The type of the text field. It can be password or text (default).
     */
    type: PropTypes.string,
    /**
     * The value of the text field. When using this property the text field will
     * be controlled.
     */
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  };

  static defaultProps = {
    floatingLabel: true,
    showBar: true,
    type: 'text',
  };

  state = {
    focused: false,
    length: (this.props.value || '').toString().length ||
      (this.props.defaultValue || '').toString().length || 0,
  };

  componentWillReceiveProps(nextProps) {
    this.setState((previousState) => {
      const newLength = nextProps.value !== undefined ?
        nextProps.value.toString().length :
        previousState.length;

      return {length: newLength};
    });
  }

  _handleFocus = (event) => {
    this.setState(() => ({focused: true}));
    if (this.props.onFocus) this.props.onFocus(event);
  };

  _handleBlur = (event) => {
    this.setState(() => ({focused: false}));
    if (this.props.onBlur) this.props.onBlur(event);
  };

  _handleChange = (event) => {
    const value = event.target.value;
    this.setState(() => ({length: value.length}));

    if (this.props.onChange) {
      this.props.onChange(event, this.props.name, value);
    }
  };

  render() {
    const {
      autoFocus,
      defaultValue,
      disabled,
      errorMessage,
      floatingLabel,
      helperText,
      invalid,
      label,
      maxLength,
      name,
      onBlur, // eslint-disable-line no-unused-vars
      onChange, // eslint-disable-line no-unused-vars
      onFocus, // eslint-disable-line no-unused-vars
      required,
      showBar,
      showCounter,
      type,
      value,
      ...userProps
    } = this.props;

    let counterElem;
    let helperTextElem;

    if (this.props.showCounter) {
      counterElem = (
        <span>{this.state.length + (maxLength ? ` / ${maxLength}` : '')}</span>
      );
    }

    if (showCounter || (invalid && errorMessage) || helperText) {
      helperTextElem = (
        <div
          className={cn(
            classes.helperText,
            invalid && classes.helperTextInvalid,
            disabled && classes.helperTextDisabled
          )}
        >
          <span>{(invalid && errorMessage) ? errorMessage : helperText}</span>
          {counterElem}
        </div>
      );
    }

    return (
      <div className={classes.container}>
        <InputText
          {...userProps}
          autoFocus={autoFocus}
          defaultValue={defaultValue}
          disabled={disabled}
          floatingLabel={floatingLabel && !this.state.length}
          focused={this.state.focused}
          invalid={invalid}
          label={label}
          maxLength={maxLength}
          name={name}
          onBlur={this._handleBlur}
          onChange={this._handleChange}
          onFocus={this._handleFocus}
          required={required}
          showBar={showBar}
          type={type}
          value={value}
        />
        {helperTextElem}
      </div>
    );
  }
}