import React from 'react';
import PropTypes from 'prop-types';
import FlatButton from '../material/FlatButton';
import Navbar from '../material/Navbar';
import TextField from '../material/TextField';
import CircularIndicator from '../material/CircularIndicator/Indeterminate';
import GitHub from '../../github/GitHub';
import RepoDownload from './RepoDownload';
import Actions from './Actions';

import classes from './OptionsPage.css';

export default class OptionsPage extends React.Component {
  static propTypes = {
    /**
     * Background page module reference.
     */
    bg: PropTypes.any,
  };

  state = {
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
    this.props.bg.updateBadge('');
    const newState = {token};

    this.setLoadingState('initializing', true);

    GitHub.updateUser()
      .then((user) => {
        newState.user = user;
        return GitHub.updateOrgs();
      })
      .then((orgs) => {
        newState.orgs = orgs;
        return this.setState(() => newState);
      })
      .finally(() => {
        this.setLoadingState('initializing', false);
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

  handleTokenTextFocus = (e) => {
    e.currentTarget.select();
  };

  handleTokenTextChange = (e) => {
    const id = e.currentTarget.id;
    const value = e.currentTarget.value;
    this.setState(() => ({[id]: value}));
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
    const {user, orgs, token} = this.state;
    let optionSections;

    if (Object.entries(user).length > 0) {
      optionSections = (
        <React.Fragment>
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

          <div className={classes.optionsSection}>
            <h2>Actions</h2>
            <div className={classes.card}>
              <Actions />
            </div>
          </div>
        </React.Fragment>
      );
    }
    else if (this.getLoadingState('initializing')) {
      optionSections = (
        <div className={classes.loaderContainer}>
          <CircularIndicator className={classes.loader} />
        </div>
      );
    }

    return (
      <div className={classes.container}>
        <Navbar title="RepoHatch" />
        {process.env.NODE_ENV === 'development' ?
          <FlatButton
            onClick={() => {
              GitHub.getEverything().then((options) => console.log('options', options));
            }}
            style={{margin: '12px auto'}}
          >
            Get saved options
          </FlatButton> : null}

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
                  onFocus={this.handleTokenTextFocus}
                />
              </div>
              <div className={classes.buttonContainer}>
                <FlatButton onClick={this.handleTokenSaveButton}>
                  Save
                </FlatButton>
              </div>
            </div>
          </div>
          {optionSections}
        </div>
      </div>
    );
  }
}