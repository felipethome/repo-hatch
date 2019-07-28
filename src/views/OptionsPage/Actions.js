import React from 'react';
import PropTypes from 'prop-types';
import FlatButton from '../material/FlatButton';
import TextField from '../material/TextField';
import Select from '../material/Select';
import GitHub from '../../github/GitHub';
import uuidv4 from 'uuid/v4';

import classes from './OptionsPage.css';

export default class Actions extends React.Component {
  static propTypes = {};

  static defaultProps = {};

  state = {
    actions: [],
  };

  componentDidMount() {
    GitHub.getSavedActions()
      .then((actions) => {
        this.setState(() => ({actions}));
      });
  }

  render() {
    const actions = Object.values(this.state.actions);

    return (
      <div>
        <table className={classes.actionsTable}>
          <thead>
            <tr>
              <th>Action name</th>
              <th>Action</th>
              <th>Optional Filter</th>
            </tr>
          </thead>
          <tbody>
            {actions.map((action) => (
              <tr key={uuidv4()}>
                <td>
                  <TextField
                    value={action.name}
                    onChange={this.handleChange}
                  />
                </td>
                <td>
                  <Select value={action.action}>
                    <option value="pulls">pulls</option>
                    <option value="issues">issues</option>
                    <option value="find/master">find in master</option>
                    <option value="search">search</option>
                  </Select>
                </td>
                <td>
                  <TextField
                    value={action.filter}
                    onChange={this.handleChange}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}
