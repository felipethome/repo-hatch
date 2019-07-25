import React from 'react';
import PropTypes from 'prop-types';
import Checkbox from '../Checkbox';
import AscIcon from '../icons/navigation/arrow-downward';
import DescIcon from '../icons/navigation/arrow-upward';
import cn from 'classnames';

import classes from './Table.css';

export default class Table extends React.Component {
  static displayName = 'Table';

  static propTypes = {
    columns: PropTypes.array,
    dataSet: PropTypes.array,
    onRowClick: PropTypes.func,
    onRowSelection: PropTypes.func,
    onSort: PropTypes.func,
    selectAll: PropTypes.bool,
    selectable: PropTypes.bool,
    selectedRows: PropTypes.array,
    sortedColumn: PropTypes.array,
  };

  static defaultProps = {
    selectAll: false,
    selectedRows: [],
  };

  _getIdIndex = (columns) => {
    for (let i = 0; i < columns.length; i++) {
      if (columns[i].id) return i;
    }

    console.error('You must provide an id column.');

    return -1;
  };

  render() {
    const {
      columns,
      dataSet,
      onRowClick,
      onRowSelection,
      onSort,
      selectAll,
      selectable,
      selectedRows,
      sortedColumn,
    } = this.props;

    const idIndex = this._getIdIndex(columns);

    const headers = columns
      .filter((column) => !column.hide).map((column, i, arr) => {
        let sortIconElem;
        let nextOrder = 'asc';

        if (sortedColumn !== undefined && sortedColumn[0] === column.header) {
          if (sortedColumn[1].toLowerCase() === 'asc') {
            sortIconElem = (<AscIcon className={classes.headerSortIcon} />);
            nextOrder = 'desc';
          }
          else {
            sortIconElem = (<DescIcon className={classes.headerSortIcon} />);
          }
        }

        return (
          <th
            key={column.header}
            className={cn(
              column.sortable && classes.clickable,
              i < arr.length && classes.cellPadding,
              column.type === 'number' && classes.number
            )}
            onClick={(event) => {
              if (onSort) onSort(event, column.header, nextOrder);
            }}
          >
            {sortIconElem}
            <span className={classes.headerText}>{column.header}</span>
          </th>
        );
      });

    const rows = dataSet.map((row) => {
      const rowId = row[idIndex];
      const selected = selectAll || selectedRows.indexOf(rowId) !== -1;

      return (
        <tr
          key={rowId}
          className={cn(
            classes.row,
            selected && classes.rowSelected,
            onRowClick && classes.clickable
          )}
          onClick={(event) => {
            if (this._selection) {
              this._selection = false;
              return;
            }
            if (onRowClick) onRowClick(event, rowId);
          }}
        >
          {
            selectable ?
              <td
                className={cn(classes.cell, classes.selectionCell)}
                onClick={() => {this._selection = true;}}
              >
                <Checkbox
                  onChange={(event) => {
                    if (onRowSelection) onRowSelection(event, rowId);
                  }}
                  checked={selected}
                />
              </td> : undefined
          }
          {row.filter((column, i) => !columns[i].hide).map((column, i, arr) => (
            <td
              key={`${columns[i].header}-${rowId}`}
              className={cn(
                classes.cell,
                i < arr.length && classes.cellPadding,
                columns[i].type === 'number' && classes.number
              )}
            >
              {column}
            </td>
          ))}
        </tr>
      );
    });

    return (
      <table className={classes.table}>
        <tbody className={classes.body}>
          <tr className={classes.headerRow}>
            {
              selectable ?
                <th className={classes.selectionCell}>
                  <Checkbox
                    onChange={(event) => {
                      if (onRowSelection) onRowSelection(event, null, true);
                    }}
                    checked={selectAll}
                    style={{visibility: 'hidden'}}
                  />
                </th> : undefined
            }
            {headers}
          </tr>
          {rows}
        </tbody>
      </table>
    );
  }
}