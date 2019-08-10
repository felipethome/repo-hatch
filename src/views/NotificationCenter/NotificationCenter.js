import React from 'react';
import PropTypes from 'prop-types';
import {insert} from 'ramda';
import uuidv4 from 'uuid/v4';
import Transition from 'react-inline-transition-group';
import Notification from './Notifcation';

import classes from './NotificationCenter.css';

export default class NotifcationCenter extends React.Component {
  static propTypes = {
    timeout: PropTypes.number,
  };

  state = {
    notifications: [],
  };

  create = ({type, message}) => {
    this.setState((previousState) => ({
      notifications: insert(0, {id: uuidv4(), type, message}, previousState.notifications),
    }));
  };

  destroy = ({id}) => {
    this.setState((previousState) => ({
      notifications: previousState.notifications.filter((notification) => (notification.id !== id)),
    }));
  };

  render() {
    const {notifications} = this.state;
    const {timeout} = this.props;

    return (
      <Transition
        className={classes.container}
        childrenStyles={{
          base: {transition: 'all 200ms', opacity: '0'},
          enter: {opacity: '1'},
          leave: {opacity: '0'},
        }}
      >
        {notifications.map((notification) => (
          <Notification
            key={notification.id}
            id={notification.id}
            type={notification.type}
            message={notification.message}
            onClose={this.destroy}
            timeout={timeout}
          />
        ))}
      </Transition>
    );
  }
}
