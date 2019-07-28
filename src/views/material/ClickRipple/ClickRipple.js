/**
 * author: Felipe Thome
 */

import React from 'react';
import PropTypes from 'prop-types';
import Transition from 'react-inline-transition-group';
import MaterialCurves from '../../styles/materialCurves';

export default class ClickRipple extends React.Component {
  static displayName = 'ClickRipple';

  static propTypes = {
    /**
     * If true, the current ripple is not removed until another one is added.
     * An example of usage is the user is still holding the mouse button down
     * so you want to keep showing the same ripple.
     */
    active: PropTypes.bool,
    /**
     * Horizontal coordinate of the ripple based on its center.
     */
    left: PropTypes.number,
    /**
     * @ignore
     */
    style: PropTypes.object,
    /**
     * @ignore
     */
    theme: PropTypes.object,
    /**
     * Vertical coordinate of the ripple based on its center.
     */
    top: PropTypes.number,
  };

  static defaultProps = {
    theme: {},
  };

  constructor(props) {
    super(props);
    this._count = 0;
  }

  state = {
    ripple: !this.props.active ? undefined : {
      left: this.props.left,
      top: this.props.top,
    },
  };

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(nextProps) {
    const newState = {};

    if (nextProps.active) {
      newState.ripple = {left: nextProps.left, top: nextProps.top};
    }
    else {
      newState.ripple = undefined;
    }

    this.setState(newState);
  }

  render() {
    const {
      active, // eslint-disable-line no-unused-vars
      left, // eslint-disable-line no-unused-vars
      style,
      theme,
      top, // eslint-disable-line no-unused-vars
      ...userProps
    } = this.props;

    const styles = {
      rippleContainer: {
        position: 'absolute',
        top: '0',
        left: '0',
        width: '100%',
        paddingTop: '100%',
      },

      ripple: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        background: theme.background || '#CCC',
        opacity: theme.opacity || '0.2',
        transform: 'translate(-50%,-50%) scale(.8)',
        transformOrigin: 'center center',
      },

      appear: {
        transform: 'translate(-50%,-50%) scale(5)',
        transition: `all 6000ms ${MaterialCurves.deceleration}`,
      },

      leave: {
        opacity: '0',
        transform: 'translate(-50%,-50%) scale(5)',
        transition: `all 500ms ${MaterialCurves.deceleration}`,
      },
    };

    const currentRipple = [];

    if (this.state.ripple) {
      const key = this._count++;
      currentRipple.push(
        <div
          id={key}
          key={key}
          style={{
            left: `${Math.round(this.state.ripple.left)}px`,
            top: `${Math.round(this.state.ripple.top)}px`,
          }}
        />
      );
    }

    return (
      <Transition
        {...userProps}
        childrenStyles={{
          base: styles.ripple,
          appear: styles.appear,
          enter: styles.appear,
          leave: styles.leave,
        }}
        style={Object.assign({}, styles.rippleContainer, style)}
      >
        {currentRipple}
      </Transition>
    );
  }
}