import React from 'react';
import PropTypes from 'prop-types';
import {dissoc} from 'ramda';
import Button from '../Button';
import CircularIndicator from '../CircularIndicator/Indeterminate';
import mcn from '../../styles/mergeClassNames';

import defaultClasses from './RaisedButton.css';

export default class RaisedButton extends React.Component {
  static displayName = 'RaisedButton';

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
    /**
     * If true, disabled the button and add a loader indicator.
     */
    loading: PropTypes.bool,
    /**
     * The button type. It can be: undefined, "reset", "submit".
     */
    type: PropTypes.oneOf(['reset', 'submit']),
  };

  static defaultProps = {
    classes: {},
  };

  render() {
    const classes = mcn({}, defaultClasses, this.props.classes);
    const otherProps = dissoc('loading', this.props);

    return (
      <Button {...otherProps} disabled={this.props.loading} classes={classes}>
        {this.props.loading ? <CircularIndicator className={classes.loader} /> : null}
        {this.props.children}
      </Button>
    );
  }
}