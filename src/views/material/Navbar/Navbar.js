/**
 * author: Felipe Thome
 * 2019
 */

import React from 'react';
import PropTypes from 'prop-types';

import classes from './Navbar.css';

export default class Navbar extends React.Component {
  static propTypes = {
    /**
     * The icon element.
     */
    icon: PropTypes.any,
    /**
     * The title that will be placed right after the icon.
     */
    title: PropTypes.any,
  };

  render() {
    return (
      <div className={classes.navbar}>
        {this.props.icon}
        <div className={classes.title}>
          {this.props.title}
        </div>
      </div>
    );
  }
}
