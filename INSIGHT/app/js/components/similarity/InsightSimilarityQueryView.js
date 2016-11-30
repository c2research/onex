var React = require('react');
var InsightConstants = require('./../../flux/constants/InsightConstants');
var InsightActions = require('./../../flux/actions/InsightActions');
var MultiTimeSeriesChart = require('./../charts/MultiTimeSeriesChart');
var {Table, Column, ColumnGroup, Cell} = require('fixed-data-table');


//TODO(charlie): color the selected one!
var DatasetNameCell = function({rowIndex, data, ...props}) {
  return <Cell {...props} >
          {rowIndex}
         </Cell>;
}

var MultiTimeSeriesChartCell = function({rowIndex, data, ...props}) {
  var query = data[rowIndex].qValues;
  var start = data[rowIndex].qStart;
  var end = data[rowIndex].qEnd;
  var querySelection = query.slice(start, end + 1);
  var result = data[rowIndex].rValues;
  var warpingPath = data[rowIndex].warpingPath;
  var chartData = {
    series: [{values: querySelection}, {values: result}],
    warpingPath: warpingPath,
    maxDomainY: 0.2
  };
  var margins = {top: 0, bottom: 0, left: 0, right: 0};

  var chart = <MultiTimeSeriesChart width={props.width - 16}
                                         height={props.height - 16}
                                         margins={margins}
                                         data={chartData}
                                         strokeWidth={1}
                                         color={'blue'} />
  return <Cell {...props}>
          {chart}
         </Cell>;
}

var InsightSimilarityQueryView = React.createClass({
  render: function() {

    var queryListViewData = {
      queryLocation: InsightConstants.QUERY_LOCATION_DATASET,
      // A list of names of the time series
      queryListDataset: [],
      queryListUpload: [],
      querySelectedIndexDataset: -1,
      querySelectedIndexUpload: -1,
    };

    var [queryList, queryIndex] = (this.props.queryLocation == InsightConstants.QUERY_LOCATION_DATASET)
                     ? [this.props.queryListDataset, this.props.querySelectedIndexDataset]
                     : [this.props.queryListUpload, this.props.querySelectedIndexUpload];

    var Queries =
      <ColumnGroup
        header={<Cell>Queries</Cell>}>
        <Column
          header={<Cell>Index</Cell>}
          cell={<DatasetNameCell data={queryList} />}
          width={15}
        />
        <Column
          header={<Cell>Time Series Query</Cell>}
          cell={<MultiTimeSeriesChartCell data={queryList} />}
          width={50}
        />
      </ColumnGroup>


    //var callbackSelectQuery = this._selectQuery;

    var tableJSX =
      <div className="viewTable">
        <Table
          rowHeight={50}
          rowsCount={queryList.length}
          width={this.props.width}
          height={this.props.height}
          groupHeaderHeight={40}
          headerHeight={40}>
          {Queries}
        </Table>
      </div>;
    //TODO(charlie): onRowClick={() => callbackSelectQuery}

    return <div> {tableJSX} </div>;
  },
  _selectQuery: function(e) {
    var rowIndex = e.target.rowIndex;
    InsightActions.selectSimilarityQuery(rowIndex);
  }

});

module.exports = InsightSimilarityQueryView;
