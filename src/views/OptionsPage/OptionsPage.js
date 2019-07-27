import React from 'react';
import RaisedButton from '../material/RaisedButton';
import Navbar from '../material/Navbar';
import TextField from '../material/TextField';
import GitHub from '../../github/GitHub';
import RepoDownload from './RepoDownload';

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
    GitHub.getToken()
      .then((token) => {
        if (token) this.initialize(`${token.slice(0, 5)}${token ? '...' : ''}`);
      });
  }

  initialize = (token) => {
    const newState = {token};

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
        return this.setState(() => newState);
      });
  };

  getLoadingState = (loaderName) => {
    return this.state.loading[loaderName];
  };

  setLoadingState = (loaderName, value) => {
    this.setState((previousState) => ({
      loading: Object.assign(previousState.loading, {[loaderName]: value}),
    }));
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
    GitHub.updateDefaults({defaultRepoSource: this.state.defaults.defaultRepoSource});
  };

  handleTokenSaveButton = () => {
    if (this.state.token.length === 40) {
      GitHub.updateToken(this.state.token)
        .then(() => {
          this.initialize(this.state.token);
        });
    }
  };

  render() {
    const {user, orgs, defaults, token} = this.state;
    let optionSections;

    if (Object.entries(user).length > 0) {
      optionSections = (
        <React.Fragment>
          <div className={classes.optionsSection}>
            <h2>General</h2>
            <div className={classes.card}>
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
              <RepoDownload
                source={user}
                updateFunction={GitHub.updateUserRepos}
              />
              {orgs.map((org) => (
                <RepoDownload
                  key={org.login}
                  source={org}
                  updateFunction={GitHub.updateAllOrgRepos}
                />
              ))}
            </div>
          </div>
        </React.Fragment>
      );
    }

    return (
      <div className={classes.container}>
        <Navbar title="G-Hub Navigation" />
        <button
          onClick={() => {
            GitHub.getEverything().then((options) => console.log('options', options));
          }}
        >
          Get saved options
        </button>

        <div className={classes.optionsContainer}>
          <div className={classes.optionsSection}>
            <h2>Token</h2>
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
              <div className={classes.saveButtonContainer}>
                <RaisedButton onClick={this.handleTokenSaveButton}>
                  Save
                </RaisedButton>
              </div>
            </div>
          </div>

          {optionSections}
        </div>
      </div>
    );
  }
}