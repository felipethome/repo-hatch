import React from 'react';

import classes from './Navbar.css';

export default class Navbar extends React.Component {
  
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
