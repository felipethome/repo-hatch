import React from 'react';
import RaisedButton from '../material/RaisedButton';
import Checkbox from '../material/Checkbox';
import Dialog from '../material/Dialog';

import classes from './OptionsPage.css';

export default class RepoDownload extends React.Component {
  state = {
    loading: {},
    options: {},
    showDialog: false,
  };

  getLoadingState = (loaderName) => {
    return this.state.loading[loaderName];
  };

  setLoadingState = (loaderName, value) => {
    this.setState((previousState) => ({
      loading: Object.assign(previousState.loading, {[loaderName]: value}),
    }));
  };

  changeDialogState = (state) => {
    this.setState(() => ({
      showDialog: state,
    }));
  };

  handleDownloadButtonClick = (e) => {
    this.changeDialogState(true);
  };

  handleDownloadConfirmation = (name) => {
    this.setLoadingState(name, true);
    this.changeDialogState(false);

    this.props.updateFunction(name, this.state.options)
      .then((repos) => {
        this.props.downloadFinished(repos);
      })
      .finally(() => {
        this.setLoadingState(name, false);
      });
  };

  handleCheckboxClick = (e) => {
    const option = e.currentTarget.name;
    const checked = e.currentTarget.checked;

    this.setState((previousState) => ({
      options: Object.assign(previousState.options, {[option]: checked}),
    }));
  };

  handleCloseDialog = () => {
    this.changeDialogState(false);
  };

  render() {
    const {source, options} = this.props;
    const dialogAction = (
      <RaisedButton onClick={this.handleDownloadConfirmation.bind(this, source.login)}>
        Continue
      </RaisedButton>
    );

    return (
      <div className={classes.repoSourceEntryContainer} key={source.login}>
        <Dialog
          title="Download Options"
          show={this.state.showDialog}
          actions={dialogAction}
          onClose={this.handleCloseDialog}
        >
          <div className={classes.dialog}>
          {options.map((option) => (
            <div className={classes.dialogCheckboxContainer} key={option.name}>
              <label>{option.label}</label>
              <Checkbox
                name={option.name}
                checked={this.state.options[option.name] || false}
                onChange={this.handleCheckboxClick}
              />
            </div>
          ))}
          </div>
        </Dialog>
        <img className={classes.repoSourceEntryImage} src={source.avatarUrl} />
        <div className={classes.repoSourceEntryTitle}>{source.login}</div>
        <RaisedButton loading={this.getLoadingState(source.login)} onClick={this.handleDownloadButtonClick}>
          Download Repos
        </RaisedButton>
      </div>
    );
  }
}
