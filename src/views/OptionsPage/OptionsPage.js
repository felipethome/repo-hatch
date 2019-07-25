import React from 'react';
import RaisedButton from '../material/RaisedButton';
import Navbar from '../material/Navbar';
import TextField from '../material/TextField';
import GitHub from '../../GitHub';

import classes from './OptionsPage.css';

export default class OptionsPage extends React.Component {
  state = {
    defaults: {
      defaultRepoSource: '',
    },
    loading: {},
    orgs: [],
    user: {},
    reposBySource: {},
    token: '',
  };

  componentDidMount() {
    const newState = {};

    GitHub.updateUser()
      .then((user) => {
        newState.user = user;
        return GitHub.updateOrgs();
      })
      .then((orgs) => {
        newState.orgs = orgs;
        return GitHub.getDefaults();
      })
      .then((defaults) => {
        newState.defaults = defaults;
        return GitHub.getToken();
      })
      .then((token) => {
        newState.token = `${token.slice(0, 5)}...`;
        this.setState(() => newState);
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

  handleTokenTextChange = (e) => {
    const id = e.currentTarget.id;
    const value = e.currentTarget.value;
    this.setState(() => ({[id]: value}));
  };

  handleDefaultsTextChange = (e) => {
    const id = e.currentTarget.id;
    const value = e.currentTarget.value;
    this.setState((previousState) => ({
      defaults: Object.assign(previousState.defaults, {[id]: value}),
    }));
  };

  handleGeneralSaveButton = () => {
    GitHub.updateToken(this.state.token);
    GitHub.updateDefaults({defaultRepoSource: this.state.defaults.defaultRepoSource});
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
    const {user, orgs, defaults, token} = this.state;

    return (
      <div className={classes.container}>
        <Navbar title="G-Hub Navigation" />
        <button onClick={() => {GitHub.getEverything().then((options) => {console.log('options', options);})}}>Get saved options</button>
        <div className={classes.optionsContainer}>
          <div className={classes.optionsSection}>
            <h2>General</h2>
            <div className={classes.card}>
              <div className={classes.field}>
                <TextField
                  id="token"
                  label="GitHub token"
                  helperText="You need a token with read access only."
                  floatingLabel
                  value={token}
                  onChange={this.handleTokenTextChange}
                />
              </div>
              <div className={classes.field}>
                <TextField
                  id="defaultRepoSource"
                  label="Default repository namespace"
                  helperText="Defaults to your username."
                  floatingLabel
                  value={defaults.defaultRepoSource}
                  onChange={this.handleDefaultsTextChange}
                />
              </div>
              <div className={classes.saveButtonContainer}>
                <RaisedButton onClick={this.handleGeneralSaveButton}>
                  Save
                </RaisedButton>
              </div>
            </div>
          </div>
          <div className={classes.optionsSection}>
            <h2>Organizations</h2>
            <div className={classes.card}>
              {this.buildRepoSourceEntry(user)}
              {orgs.map(this.buildRepoSourceEntry)}
            </div>
          </div>
        </div>
      </div>
    );
  }
}