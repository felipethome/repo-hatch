/**
 * author: Felipe Thome
 * 2017
 */

import React from 'react';
import PropTypes from 'prop-types';
import Button from '../Button';
import mcn from '../../styles/mergeClassNames';

import defaultClasses from './IconButton.css';

export default class IconButton extends React.Component {
  static displayName = 'IconButton';

  static propTypes = {
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
  };

  static defaultProps = {
    classes: {},
  };

  render() {
    const classes = mcn({}, defaultClasses, this.props.classes);

    return (
      <Button {...this.props} centeredRipple classes={classes} />
    );
  }
}