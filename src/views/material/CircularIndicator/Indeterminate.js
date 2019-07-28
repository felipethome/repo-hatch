/**
 * author: Felipe Thome
 */

import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import classes from './Indeterminate.css';

export default class CircularIndicatorIndeterminate extends React.Component {
  static displayName = 'CircularIndicatorIndeterminate';

  static propTypes = {
    /**
     * @ignore
     */
    className: PropTypes.string,
  };

  render() {
    return (
      <svg
        className={cn(classes.svg, this.props.className)}
        viewBox="0 0 66 66"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          className={classes.path}
          cx="33"
          cy="33"
          r="30"
        />
      </svg>
    );
  }
}