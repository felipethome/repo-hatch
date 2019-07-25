import React from 'react';
import RaisedButton from '../material/RaisedButton';
import Navbar from '../material/Navbar';
import GitHub from '../../GitHub';

import classes from './OptionsPage.css';

export default class OptionsPage extends React.Component {
  state = {
    user: {},
    orgs: [],
    loading: {},
    reposBySource: {},
  };

  componentDidMount() {
    GitHub.updateUser().then((user) => {
      GitHub.updateOrgs().then((orgs) => {
        this.setState(() => ({user, orgs}));
      });
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
    const name = e.currentTarget.id;
    const {user} = this.state;
    const f = name === user.login ? GitHub.updateUserRepos : GitHub.updateAllOrgRepos;

    this.setLoadingState(name, true);

   f(e.currentTarget.id)
      .then((repos) => {
        this.setState((previousState) => ({
          reposBySource: Object.assign(previousState.reposBySource, {[name]: repos}),
        }));
      })
      .finally(() => {
        this.setLoadingState(name, false);
      });
  };

  buildRepoSourceEntry = (source) => {
    return (
      <div className={classes.repoSourceEntryContainer} key={source.login}>
        <img className={classes.repoSourceEntryImage} src={source.avatarUrl} />
        <div className={classes.repoSourceEntryTitle}>{source.login}</div>
        <RaisedButton id={source.login} loading={this.getLoadingState(source.login)} onClick={this.handleDownloadButtonClick}>
          Download Repos
        </RaisedButton>
      </div>
    );
  };

  render() {
    const {user, orgs} = this.state;

    return (
      <div className={classes.container}>
        <Navbar title="G-Hub Navigation" />
        <div className={classes.optionsContainer}>
          <div className={classes.optionsSection}>
            <h2>Organizations</h2>
            <div className={classes.card}>
              <button onClick={() => {GitHub.getEverything().then((options) => {console.log('options', options);})}}>Get saved options</button>
              {this.buildRepoSourceEntry(user)}
            </div>
          </div>
        </div>
      </div>
    );
  }
}