/**
 * author: Felipe Thome
 */

import React from 'react';
import PropTypes from 'prop-types';
import ClickRipple from '../ClickRipple';
import keycode from 'keycode';

export default class Button extends React.Component {
  static displayName = 'Button';

  static propTypes = {
    /**
     * Always start the ripple from the center of the button.
     */
    centeredRipple: PropTypes.bool,
    /**
     * Anything passed as children of the button will be presented inside of it
     * and centered vertically and horizontally.
     */
    children: PropTypes.any,
    /**
     * @ignore
     */
    classes: PropTypes.object,
    /**
     * If true, the user will not be able to interact with the button.
     */
    disabled: PropTypes.bool,
    /**
     * Disable the click ripple.
     */
    disabledRipple: PropTypes.bool,
    /**
     * @ignore
     */
    onContextMenu: PropTypes.func,
    /**
     * @ignore
     */
    onKeyDown: PropTypes.func,
    /**
     * @ignore
     */
    onMouseDown: PropTypes.func,
    /**
     * @ignore
     */
    onTouchStart: PropTypes.func,
    /**
     * The button type. It can be: undefined, "reset", "submit".
     */
    type: PropTypes.oneOf(['reset', 'submit']),
  };

  static defaultProps = {
    classes: {},
  };

  constructor(props) {
    super(props);
    this._pos = {};
  }

  state = {
    active: false,
  };

  componentWillUnmount() {
    document.removeEventListener('mouseup', this._handleMouseUp);
    document.removeEventListener('touchend', this._handleTouchEnd);
  }

  _handleMouseDown = (event) => {
    if (this.props.disabled) return;

    document.addEventListener('mouseup', this._handleMouseUp);

    if (this.props.centeredRipple) {
      this._pos = this._getButtonCenter();
    }
    else {
      const bcr = this._root.getBoundingClientRect();
      this._pos = {
        x: event.clientX - bcr.left,
        y: event.clientY - bcr.top,
      };
    }


    this.setState(() => ({active: true}));

    // Cancel text selection.
    // event.preventDefault();

    // Set focus manually since we called preventDefault().
    if (this._root) this._root.focus();

    if (this.props.onMouseDown) this.props.onMouseDown(event);
  };

  // This handler is attached to a document listener. It will fire even
  // if the pointer is outside the browser window.
  _handleMouseUp = () => {
    document.removeEventListener('mouseup', this._handleMouseUp);
    this.setState(() => ({active: false}));
  };

  _handleTouchStart = (event) => {
    if (this.props.disabled) return;

    document.addEventListener('touchend', this._handleTouchEnd);

    if (this.props.centeredRipple) {
      this._pos = this._getButtonCenter();
    }
    else {
      const bcr = this._root.getBoundingClientRect();
      this._pos = {
        x: event.touches[0].clientX - bcr.left,
        y: event.touches[0].clientY - bcr.top,
      };
    }

    this.setState(() => ({active: true}));

    if (this.props.onTouchStart) this.props.onTouchStart(event);
  };

  // This handler is attached to a document listener. It will fire even
  // if the pointer is outside the browser window.
  _handleTouchEnd = (event) => {
    document.removeEventListener('touchend', this._handleTouchEnd);
    this.setState(() => ({active: false}));

    // Do not let mousedown fire.
    // https://www.w3.org/TR/touch-events/#list-of-touchevent-types
    event.preventDefault();
  };

  _handleKeyDown = (event) => {
    if (this.props.disabled) return;

    if (keycode(event) === 'space' || keycode(event) === 'enter') {
      this._activateRippleFromCenter();
    }

    if (this.props.onKeyDown) this.props.onKeyDown(event);
  };

  _handleContextMenu = (event) => {
    if (event.button !== undefined && event.button === 2) return;
    event.preventDefault();
    event.stopPropagation();
    if (this.props.onContextMenu) this.props.onContextMenu(event);
  };

  _activateRippleFromCenter = () => {
    this._pos = this._getButtonCenter();
    this.setState(() => ({active: true}), () => {
      this.setState(() => ({active: false}));
    });
  };

  _getButtonCenter = () => {
    return {
      x: this._root.offsetWidth / 2,
      y: this._root.offsetHeight / 2,
    };
  };

  render() {
    const {
      centeredRipple, // eslint-disable-line no-unused-vars
      children,
      classes, // eslint-disable-line no-unused-vars
      disabled, // eslint-disable-line no-unused-vars
      disabledRipple, // eslint-disable-line no-unused-vars
      onContextMenu, // eslint-disable-line no-unused-vars
      onKeyDown, // eslint-disable-line no-unused-vars
      onMouseDown, // eslint-disable-line no-unused-vars
      onTouchStart, // eslint-disable-line no-unused-vars
      type,
      ...userProps
    } = this.props;

    const clickRippleElem = disabledRipple ? undefined : (
      <ClickRipple
        active={this.state.active}
        left={this._pos.x}
        top={this._pos.y}
      />
    );

    return (
      <button
        {...userProps}
        className={classes.button}
        disabled={disabled}
        onMouseDown={this._handleMouseDown}
        onTouchStart={this._handleTouchStart}
        onContextMenu={this._handleContextMenu}
        onKeyDown={this._handleKeyDown}
        type={type}
        ref={(elem) => this._root = elem}
      >
        {clickRippleElem}
        <div className={classes.childrenContainer}>
          {children}
        </div>
      </button>
    );
  }
}