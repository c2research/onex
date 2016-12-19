var React = require('react');
var InsightConstants = require('./../../flux/constants/InsightConstants');
var InsightActions = require('./../../flux/actions/InsightActions');

var MultiTimeSeriesChart = require('./../charts/MultiTimeSeriesChart');
var InsightSimilarityQueryOptions = require('./InsightSimilarityQueryOptions');

var {Table, Column, ColumnGroup, Cell} = require('fixed-data-table');

var NameCell = function({rowIndex, data, queryIndex, ...props}) {
  var style = {};
  if (queryIndex == rowIndex) {
    style = {
      backgroundColor: '#bbcddb'
    }
  }
  return (
    <Cell {...props} style={style} >
      {data[rowIndex].getName()}
    </Cell>);
}

var MultiTimeSeriesChartCell = function({rowIndex, data, queryIndex, ...props}) {
  var timeSeries = data[rowIndex];
  var commonXDomain = [timeSeries.getStart(), timeSeries.getEnd()];
  var YDomain = [timeSeries.getMin(), timeSeries.getMax()];
  var chartData = {
    series: [{values: timeSeries.getValues()}],
    domains: { x: commonXDomain, y: YDomain},
  };

  var margins = {top: 0, bottom: 0, left: 0, right: 0};
  var chart =
    <MultiTimeSeriesChart
      width={props.width - 16}
      height={props.height - 16}
      margins={margins}
      strokeWidth={1}
      data={chartData}
      color={'blue'}
      showToolTip={false}
    />

   var style = {};
   if (queryIndex == rowIndex) {
     style = {
       backgroundColor: '#bbcddb'
     }
   }
  return (
    <Cell {...props} style={style}>
      {chart}
    </Cell>);
}

var InsightSimilarityQueryView = React.createClass({

  getInitialState: function() {
    return {
      indexColumnWidth: 200,
    };
  },

  _onColumnResizeEndCallback: function(newColumnWidth, columnKey) {
    this.setState({indexColumnWidth: newColumnWidth});
  },

  render: function() {
    var [queryList, queryIndex] = (this.props.queryLocation == InsightConstants.QUERY_LOCATION_DATASET)
      ? [this.props.queryListDataset, this.props.querySelectedIndexDataset]
      : [this.props.queryListUpload, this.props.querySelectedIndexUpload];

    var queryLocation = this.props.queryLocation;
    var QueriesJSX =
      <ColumnGroup
        header={<InsightSimilarityQueryOptions queryLocation={queryLocation}/>}>
        <Column
          columnKey="index"
          header={<Cell>Index</Cell>}
          cell={<NameCell data={queryList} queryIndex={queryIndex} />}
          width={this.state.indexColumnWidth}
          isResizable={true}
        />
        <Column
          header={<Cell>Time Series Query</Cell>}
          cell={<MultiTimeSeriesChartCell data={queryList} queryIndex={queryIndex} />}
          width={0}
          flexGrow={1}
        />
      </ColumnGroup>;
      
    var tableJSX =
      <div className="viewTable">
        <Table
          rowHeight={50}
          rowsCount={queryList.length}
          width={this.props.width}
          height={this.props.height}
          groupHeaderHeight={60}
          headerHeight={40}
          onColumnResizeEndCallback={this._onColumnResizeEndCallback}
          isColumnResizing={false}
          onRowClick={this._selectQuery}>
          {QueriesJSX}
        </Table>
      </div>;

    return <div>
            {tableJSX}
           </div>;
  },
  _selectQuery: function(e, rowIndex) {
    InsightActions.selectSimilarityQuery(rowIndex);
    InsightActions.loadSimilarityQuery();
  }
});

module.exports = InsightSimilarityQueryView;
