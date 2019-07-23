import React from 'react';

import classes from './OptionsPage.css';

export default class OptionsPage extends React.Component {
  state = {
    orgs: [],
  };

  componentDidMount() {
    const bg = this.props.bg;
    bg.getAllOrgs().then((orgsResponse) => {
      this.setState(() => ({orgs: orgsResponse.body}));
    });
  }

  render() {
    const {orgs} = this.state;

    console.log('render');

    console.log(classes);

    return (
      <div>
        {orgs.map((org) => (
          <div key={org.login}>
            <img className={classes.avatarImage} src={org.avatar_url} />
          </div>
        ))}
      </div>
    );
  }
}