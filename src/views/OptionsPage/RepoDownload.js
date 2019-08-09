import React from 'react';
import PropTypes from 'prop-types';
import FlatButton from '../material/FlatButton';
import Checkbox from '../material/Checkbox';
import Dialog from '../material/Dialog';

import classes from './OptionsPage.css';

export default class RepoDownload extends React.Component {
  static propTypes = {
    /**
     * Called when the download of the repos is finished.
     */
    downloadFinished: PropTypes.func,
    /**
     * The download options. If not empty it will render a modal with checkboxes,
     * for all download options supplied in this property when the user clicks on
     * the download button.
     */
    options: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string,
      name: PropTypes.string,
    })),
    /**
     * The object with the organization or user data.
     */
    source: PropTypes.object,
    /**
     * The function to be called when the user clicks on the download button.
     */
    updateFunction: PropTypes.func,
  };

  static defaultProps = {
    options: [],
  };

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

  handleDownloadButtonClick = () => {
    this.changeDialogState(true);
  };

  handleDownloadConfirmation = (name) => {
    this.setLoadingState(name, true);
    this.changeDialogState(false);

    this.props.updateFunction(name, this.state.options)
      .then((repos) => {
        if (this.props.downloadFinished) this.props.downloadFinished(repos);
      })
      .catch((err) => {
        console.error(err);
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
    const dialog = options.length ? (
      <Dialog
        title="Download Options"
        show={this.state.showDialog}
        actions={
          <FlatButton onClick={this.handleDownloadConfirmation.bind(this, source.login)}>
            Continue
          </FlatButton>
        }
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
    ) : null;

    return (
      <div className={classes.repoSourceEntryContainer} key={source.login}>
        {dialog}
        <div className={classes.repoSourceEntryImageContainer}>
          <img className={classes.repoSourceEntryImage} src={source.avatarUrl} />
        </div>
        <div className={classes.repoSourceEntryTitle}>{source.login}</div>
        <FlatButton
          loading={this.getLoadingState(source.login)}
          onClick={options.length ? this.handleDownloadButtonClick :
            this.handleDownloadConfirmation.bind(this, source.login)}
        >
          Download Repos Metadata
        </FlatButton>
      </div>
    );
  }
}
