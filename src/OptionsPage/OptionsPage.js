import React from 'react';

export default class OptionsPage extends React.Component {
  componentDidMount() {
    const bg = this.props.bg;
    bg.getAllOrgs().then((orgs) => console.log(orgs));
  }

  render() {
    return (
      <div>Hello!</div>
    );
  }
}