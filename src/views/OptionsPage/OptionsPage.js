import React from 'react';
import RaisedButton from '../material/RaisedButton';
import Navbar from '../material/Navbar';
import GitHub from '../../GitHub';

import classes from './OptionsPage.css';

export default class OptionsPage extends React.Component {
  state = {
    orgs: [],
    loading: {},
    reposBySource: {},
  };

  componentDidMount() {
    GitHub.updateOrgs().then((orgs) => {
      this.setState(() => ({orgs}));
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
    const orgName = e.currentTarget.id;

    this.setLoadingState(orgName, true);

    GitHub.updateAllOrgRepos(e.currentTarget.id)
      .then((repos) => {
        this.setState((previousState) => ({
          reposBySource: Object.assign(previousState.reposBySource, {orgName: repos}),
        }));
      })
      .finally(() => {
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
              <button onClick={() => {GitHub.getEverything().then((options) => {console.log('options', options);})}}>Get saved options</button>
              {orgs.map((org) => (
                <div className={classes.orgContainer} key={org.login}>
                  <img className={classes.orgImage} src={org.avatarUrl} />
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