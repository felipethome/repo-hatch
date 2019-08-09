import React from 'react';
import {insert} from 'ramda';
import uuidv4 from 'uuid/v4';
import Notification from './Notifcation';

import classes from './NotificationCenter.css';

export default class NotifcationCenter extends React.Component {
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

    return (
      <div className={classes.container}>
        {notifications.map((notification) => (
          <Notification
            key={notification.id}
            id={notification.id}
            type={notification.type}
            message={notification.message}
            onClose={this.destroy}
          />
        ))}
      </div>
    );
  }
}
