var React = require('react');
var InsightConstants = require('./../../flux/constants/InsightConstants');
var InsightActions = require('./../../flux/actions/InsightActions');

var MultiTimeSeriesChart = require('./../charts/MultiTimeSeriesChart');

var {Table, Column, ColumnGroup, Cell} = require('fixed-data-table');

var NameCell = function({rowIndex, data, groupSelectedIndex, showingRepresentatives, ...props}) {
  var style = {};
  if (groupSelectedIndex == rowIndex) {
    style = {
      backgroundColor: '#bbcddb'
    }
  }
  var name = showingRepresentatives ? (data[rowIndex].getName().toFixed(2) + '%') : rowIndex;

  return (
    <Cell {...props} style={style} >
      {name}
    </Cell>);
}

var MultiTimeSeriesChartCell = function({rowIndex, data, groupSelectedIndex, ...props}) {
  // var query = data[rowIndex].qValues;
  // var start = data[rowIndex].qStart;
  // var end = data[rowIndex].qEnd;
  // var querySelection = query.slice(start, end + 1);
  // var result = data[rowIndex].rValues;
  // var warpingPath = data[rowIndex].warpingPath;
  // var chartData = {
  //   series: [{values: querySelection}, {values: result}],
  //   warpingPath: warpingPath,
  //   maxDomainY: 0.2
  // };
  var timeSeries = data[rowIndex];
  var commonXDomain = [timeSeries.getStart(), timeSeries.getEnd()];

  var chartData = {
    series: [{values: timeSeries.getValues()}],
    domains: { x: commonXDomain, y: [0, 1]},
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
   if (groupSelectedIndex == rowIndex) {
     style = {
       backgroundColor: '#bbcddb'
     }
   }
  return (
    <Cell {...props} style={style}>
      {chart}
    </Cell>);
}

var InsightSimilarityGroupView = React.createClass({
  render: function() {
    var style = {
      width: this.props.width,
      height: this.props.height
    }

    var widthIndex = this.props.width * 0.2;
    var widthChart = this.props.width * 0.8;

    var [title, firstColumnName, secondColumnName] = this.props.showingRepresentatives
      ? ['Dataset Overview', 'Percent', 'Cluster Representatives']
      : ['Similarity Overview', 'Kth Nearest','Top Matches'];

    var GroupsJSX =
      <ColumnGroup
        header={<Cell>{title}</Cell>}>
        <Column
          header={<Cell>{firstColumnName}</Cell>}
          cell={<NameCell data={this.props.groupList}
                          groupSelectedIndex={this.props.groupSelectedIndex}
                          showingRepresentatives={this.props.showingRepresentatives} />}
          width={widthIndex}
          groupSelectedIndex={this.props.groupSelectedIndex}
        />
        <Column
          header={<Cell>{secondColumnName}</Cell>}
          cell={<MultiTimeSeriesChartCell data={this.props.groupList}
                                          groupSelectedIndex={this.props.groupSelectedIndex} />}
          width={widthChart}
          groupSelectedIndex={this.props.groupSelectedIndex}
        />
      </ColumnGroup>

    var tableJSX =
      <div className="viewTable">
        <Table
          rowHeight={50}
          rowsCount={this.props.groupList.length}
          width={this.props.width}
          height={this.props.height}
          groupHeaderHeight={40}
          headerHeight={40}
          onRowClick={this._selectGroup}>
          {GroupsJSX}
        </Table>
      </div>;

    return (
      <div style={style}>
        {tableJSX}
      </div>);
  },
  _selectGroup: function(e, rowIndex) {
    InsightActions.selectSimilarityGroup(rowIndex);
  }
});

module.exports = InsightSimilarityGroupView;
