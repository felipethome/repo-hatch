import React from 'react';
import RaisedButton from '../material/RaisedButton';
import Navbar from '../material/Navbar';

import classes from './OptionsPage.css';

export default class OptionsPage extends React.Component {
  state = {
    orgs: [],
    loading: {},
    reposBySource: {},
  };

  componentDidMount() {
    const bg = this.props.bg;
    bg.getAllOrgs().then((orgsResponse) => {
      this.setState(() => ({orgs: orgsResponse.body}));
    });
  }

  getLoadingState = (loaderName) => {
    return this.state.loading[loaderName];
  };

  setLoadingState = (loaderName, value) => {
    this.setState((previousState) => ({
      loading: Object.assign(previousState.loading, {[loaderName]: value}),
    }));
  };

  handleDownloadButtonClick = (e) => {
    const bg = this.props.bg;
    const orgName = e.currentTarget.id;

    this.setLoadingState(orgName, true);

    bg.getAllOrgRepos(e.currentTarget.id)
      .then((repos) => {
        console.log("!!! repos", repos);
        this.setState((previousState) => ({
          reposBySource: Object.assign(previousState.reposBySource, {orgName: repos}),
        }));
      })
      .finally(() => {
        console.log("!!! finally");
        this.setLoadingState(orgName, false);
      });
  };

  render() {
    const {orgs} = this.state;

    return (
      <div className={classes.container}>
        <Navbar title="Dev Extension" />
        <div className={classes.optionsContainer}>
          <div className={classes.optionsSection}>
            <h2>Organizations</h2>
            <div className={classes.card}>
              {orgs.map((org) => (
                <div className={classes.orgContainer} key={org.login}>
                  <img className={classes.orgImage} src={org.avatar_url} />
                  <div className={classes.orgTitle}>{org.login}</div>
                  <RaisedButton id={org.login} loading={this.getLoadingState(org.login)} onClick={this.handleDownloadButtonClick}>
                    Download Repos
                  </RaisedButton>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
}