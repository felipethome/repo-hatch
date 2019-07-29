import React from 'react';
import cn from 'classnames';
import {flatten, groupBy, insert} from 'ramda';
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

  buildInitialAction = () => {
    return {
      id: uuidv4(),
      name: '',
      action: 'pulls',
      filter: '',
    };
  };

  handleAddButtonClick = () => {
    this.setState((previousState) => ({
      actions: insert(0, this.buildInitialAction(), previousState.actions),
    }));
  };

  handleSaveButtonClick = () => {
    GitHub.updateSavedActions(this.state.actions);
  };

  handleChange = (id, attr, e) => {
    const value = e.currentTarget.value;

    this.setState((previousState) => {
      const actionsById = groupBy((action) => action.id, previousState.actions);
      actionsById[id][0][attr] = value;

      return {
        actions: flatten(Object.values(actionsById)),
      };
    });
  };

  render() {
    const {actions} = this.state;

    return (
      <div>
        <div className={cn(classes.buttonContainer, classes.paddingBottom)}>
          <FlatButton onClick={this.handleAddButtonClick}>Add</FlatButton>
          <FlatButton onClick={this.handleSaveButtonClick}>Save</FlatButton>
        </div>
        <table className={classes.actionsTable}>
          <thead>
            <tr>
              <th>Action alias</th>
              <th>Action</th>
              <th>Optional filter</th>
            </tr>
          </thead>
          <tbody>
            {actions.map((action) => (
              <tr key={action.id}>
                <td>
                  <TextField
                    value={action.name}
                    onChange={this.handleChange.bind(this, action.id, 'name')}
                  />
                </td>
                <td>
                  <Select value={action.action} onChange={this.handleChange.bind(this, action.id, 'action')}>
                    <option value="pulls">pulls</option>
                    <option value="issues">issues</option>
                    <option value="find/master">find in master</option>
                    <option value="search">search</option>
                  </Select>
                </td>
                <td>
                  <TextField
                    value={action.filter || ''}
                    onChange={this.handleChange.bind(this, action.id, 'filter')}
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
