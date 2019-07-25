import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import Table from './Table';
import IconButton from '../IconButton';
import BeforeIcon from '../icons/navigation/chevron-left';
import NextIcon from '../icons/navigation/chevron-right';
import Button from '../Button';

import classes from './TableWrapper.css';

export default class TableWrapper extends React.Component {
  static displayName = 'TableWrapper';

  static propTypes = {
    actions: PropTypes.array,
    columns: PropTypes.array.isRequired,
    dataSet: PropTypes.array.isRequired,
    hideFooter: PropTypes.bool,
    hideHeader: PropTypes.bool,
    i18nMessages: PropTypes.object,
    numberOfRows: PropTypes.number,
    onPageChange: PropTypes.func,
    onRowClick: PropTypes.func,
    onRowSelection: PropTypes.func,
    onRowsPerPageChange: PropTypes.func,
    onSort: PropTypes.func,
    pageNumber: PropTypes.number,
    rowsPerPage: PropTypes.oneOf(['10', '20', '50', '100', 10, 20, 50, 100]),
    selectAll: PropTypes.bool,
    selectable: PropTypes.bool,
    selectedRows: PropTypes.array,
    sortedColumn: PropTypes.array,
    title: PropTypes.any,
  };

  static defaultProps = {
    actions: [],
    i18nMessages: {
      rows: 'Rows',
      of: 'of',
      itemSelected: 'item selected',
      itemsSelected: 'items selected',
    },
    pageNumber: 1,
    rowsPerPage: 10,
    onRowsPerPageChange: () => {},
    selectedRows: [],
  };

  _handlePreviousPageClick = (event) => {
    if (this.props.onPageChange) {
      this.props.onPageChange(event, Math.max(1, this.props.pageNumber - 1));
    }
  };

  _handleNextPageClick = (event) => {
    const {dataSet, onPageChange, pageNumber, rowsPerPage} = this.props;
    const numberOfRows = this.props.numberOfRows !== undefined ?
      this.props.numberOfRows : dataSet.length;

    const nextPageNumber = pageNumber * rowsPerPage >= numberOfRows ?
      (pageNumber) : pageNumber + 1;

    if (onPageChange) {
      onPageChange(event, nextPageNumber);
    }
  };

  _handleRowsPerPageChange = (event) => {
    if (this.props.onRowsPerPageChange) {
      this.props.onRowsPerPageChange(event, event.currentTarget.value);
    }
  };

  render() {
    const {
      actions,
      columns,
      dataSet,
      hideFooter,
      hideHeader,
      i18nMessages: i18n,
      numberOfRows = dataSet.length,
      onRowClick,
      onRowSelection,
      onSort,
      pageNumber,
      rowsPerPage,
      selectAll,
      selectable,
      selectedRows,
      sortedColumn,
      title: defaultTitle,
    } = this.props;

    let title = defaultTitle;
    if (Array.isArray(defaultTitle)) {
      title = defaultTitle.map((titleAction) => (
        <Button
          disabledRipple
          classes={{button: classes.titleAction}}
          key={titleAction.name}
        >
          {titleAction.name}
        </Button>
      ));
    }
    if (selectedRows.length) {
      if (selectedRows.length === 1) {
        title = `${selectedRows.length} ${i18n.itemSelected}`;
      }
      else {
        title = `${selectedRows.length} ${i18n.itemsSelected}`;
      }
    }

    const begin = (pageNumber - 1) * rowsPerPage;
    const end =  Math.min(pageNumber * rowsPerPage, numberOfRows);
    const slicedDataSet = dataSet.slice(begin, end);

    const actionsElem = actions
      .filter((action) => (
        selectedRows.length ? action.selection : !action.selection
      ))
      .map((action) => (
        <IconButton
          classes={{button: classes.headerIconButton}}
          key={action.name}
          // eslint-disable-next-line react/jsx-handler-names
          onTouchEnd={(event) => {action.onTouchEnd(event, selectedRows);}}
          // eslint-disable-next-line react/jsx-handler-names
          onClick={(event) => {action.onClick(event, selectedRows);}}
        >
          {React.cloneElement(action.icon, {className: classes.icon})}
        </IconButton>
      ));

    const headerElem = hideHeader ? undefined : (
      <div
        className={cn(
          classes.header,
          selectedRows.length && classes.headerWithItemsSelected
        )}
      >
        <h2 className={classes.title}>{title}</h2>
        {actionsElem}
      </div>
    );

    const footerElem = hideFooter ? undefined : (
      <div className={classes.footer}>
        <div className={classes.footerControlSets}>
          <span className={classes.rowCountLabel}>{`${i18n.rows}:`}</span>
          <div className={classes.selectFieldContainer}>
            <select
              className={classes.selectField}
              onChange={this._handleRowsPerPageChange}
              value={rowsPerPage}
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>
        </div>
        <div className={classes.footerControlSets}>
          <span className={classes.pageText}>
            {begin + 1} - {end} {i18n.of} {numberOfRows}
          </span>
        </div>
        <div className={classes.footerControlSets}>
          <IconButton
            className={classes.pageIconButton}
            onTouchEnd={this._handlePreviousPageClick}
            onClick={this._handlePreviousPageClick}
          >
            <BeforeIcon className={classes.icon} />
          </IconButton>
          <IconButton
            classes={{button: classes.pageIconButton}}
            onTouchEnd={this._handleNextPageClick}
            onClick={this._handleNextPageClick}
          >
            <NextIcon className={classes.icon} />
          </IconButton>
        </div>
      </div>
    );

    const tableElem = !dataSet.length ? undefined : (
      <div className={classes.tableContainer}>
        <Table
          columns={columns}
          dataSet={slicedDataSet}
          selectAll={selectAll}
          selectable={selectable}
          selectedRows={selectedRows}
          sortedColumn={sortedColumn}
          onRowClick={onRowClick}
          onRowSelection={onRowSelection}
          onSort={onSort}
        />
      </div>
    );

    return (
      <div className={classes.container}>
        {headerElem}
        {tableElem}
        {footerElem}
      </div>
    );
  }
}