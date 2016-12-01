var React = require('react');
var InsightConstants = require('./../../flux/constants/InsightConstants');
var InsightActions = require('./../../flux/actions/InsightActions');

var MultiTimeSeriesChart = require('./../charts/MultiTimeSeriesChart');
var InsightSimilarityQuery = require('./InsightSimilarityQuery');

var {Table, Column, ColumnGroup, Cell} = require('fixed-data-table');

var NameCell = function({rowIndex, data, queryIndex, ...props}) {
  var style = {};
  if (queryIndex == rowIndex) {
    style = {
      backgroundColor: '#2daf89'
    }
  }
  return (
    <Cell {...props} style={style} >
      {data[rowIndex]}
    </Cell>);
}

var MultiTimeSeriesChartCell = function({rowIndex, data, queryIndex, ...props}) {
  //TODO(charlie): uncomment
  // var timeSeries = data[rowIndex];
  // var commonXDomain = [timeSeries.getStart(), timeSeries.getEnd()];
  //
  // var chartData = {
  //   series: [{values: timeSeries.getValues()}],
  //   domains: { x: commonXDomain, y: [0, 1]},
  // };

  var chartData = {
    series: [{values: []}],
    domains: { x: [0, 100], y: [0, 1]},
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
    />

   var style = {};
   if (queryIndex == rowIndex) {
     style = {
       backgroundColor: '#2daf89'
     }
   }
  return (
    <Cell {...props} style={style}>
      {chart}
    </Cell>);
}

var InsightSimilarityQueryView = React.createClass({
  render: function() {
    var [queryList, queryIndex] = (this.props.queryLocation == InsightConstants.QUERY_LOCATION_DATASET)
      ? [this.props.queryListDataset, this.props.querySelectedIndexDataset]
      : [this.props.queryListUpload, this.props.querySelectedIndexUpload];

    var widthIndex = this.props.width * 0.4;
    var widthChart = this.props.width * 0.6;

    var queryLocation = this.props.queryLocation;
    var QueriesJSX =
      <ColumnGroup
        header={<InsightSimilarityQuery queryLocation={queryLocation}/>}>
        <Column
          header={<Cell>Index</Cell>}
          cell={<NameCell data={queryList} queryIndex={queryIndex} />}
          width={widthIndex}
        />
        <Column
          header={<Cell>Time Series Query</Cell>}
          cell={<MultiTimeSeriesChartCell data={queryList} queryIndex={queryIndex} />}
          width={widthChart}
        />
      </ColumnGroup>

    var tableJSX =
      <div className="viewTable">
        <Table
          rowHeight={50}
          rowsCount={queryList.length}
          width={this.props.width}
          height={this.props.height}
          groupHeaderHeight={60}
          headerHeight={40}
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
  }
});

module.exports = InsightSimilarityQueryView;
