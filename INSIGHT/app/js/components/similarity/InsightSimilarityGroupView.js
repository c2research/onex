var d3 = require('d3');
var React = require('react');
var InsightConstants = require('./../../flux/constants/InsightConstants');
var InsightActions = require('./../../flux/actions/InsightActions');

var MultiTimeSeriesChart = require('./../charts/MultiTimeSeriesChart');

var {Table, Column, ColumnGroup, Cell} = require('fixed-data-table');

var selectedColor = '#ff9a3d';

var PercentageCell = function({rowIndex, data, colorFunc, ...props}) {
  var percent = data[rowIndex].getName();
  var name = (100* percent).toFixed(2) + '%';
  return (
    <Cell {...props} style={{backgroundColor: colorFunc(percent)}} >
      {name}
    </Cell>);
};

var MultiTimeSeriesChartCell = function({rowIndex, data, selectedIndex, ...props}) {
  var timeSeries = data[rowIndex];
  var commonXDomain = [timeSeries.getStart(), timeSeries.getEnd()];
  var commonYDomain = [timeSeries.getMin(), timeSeries.getMax()];
  var chartData = {
    series: [{values: timeSeries.getValues()}],
    domains: { x: commonXDomain, y: commonYDomain },
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

  //TODO(charlie): when we add viewing the group this can be used
  var style = {}; //selectedIndex == rowIndex ? { backgroundColor: selectedColor } : {};
  return (
    <Cell {...props} style={style}>
      {chart}
    </Cell>);
};

var NameCell = function({rowIndex, data, selectedIndex, ...props}) {
  var ts = data[rowIndex];
  var name = ts.getName();
  var style = selectedIndex == rowIndex ? { backgroundColor: selectedColor } : {};
  return <Cell {...props} style={style}>
           {name}
         </Cell>;
};

var InsightSimilarityGroupView = React.createClass({
  render: function() {
    var GroupsJSX = null;
    if (this.props.showingRepresentatives) {
      GroupsJSX = <InsightSimilarityGroupViewRepresentatives {...this.props} />
    }
    else {
      GroupsJSX = <InsightSimilarityGroupViewSequence {...this.props} />
    }
    return GroupsJSX;
  }
});

var InsightSimilarityGroupViewRepresentatives = React.createClass({

  getInitialState: function() {
    return {
      percentColumnWidth: 100,
    };
  },

  _onColumnResizeEndCallback: function(newColumnWidth, columnKey) {
    this.setState({percentColumnWidth: newColumnWidth});
  },

  render: function() {
    var percents = this.props.representatives.map(function(timeSeries){
      return timeSeries.getName();
    });

    var colorFunc = d3.scalePow()
                      .exponent(0.5)
                      .domain([Math.min(...percents), Math.max(...percents)])
                      .range(["#efefef", "#357cb7"])
                      .interpolate(d3.interpolateCubehelix);

    var ColumnGroupsJSX =
          <ColumnGroup
            header={<TableHeader title={"Dataset Overview"} icon={"toggle-off"}/>}>

            <Column
              columnKey="percent"
              header={<Cell>Percent</Cell>}
              cell={<PercentageCell data={this.props.representatives}
                                    colorFunc={colorFunc} />}
              width={this.state.percentColumnWidth}
              isResizable={true}
            />
            <Column
              header={<Cell>Cluster Representatives</Cell>}
              cell={<MultiTimeSeriesChartCell data={this.props.representatives}
                                              selectedIndex={this.props.representativesSelectedIndex} />}
              width={0}
              flexGrow={1}
            />
          </ColumnGroup>;
    var style = {
      width: this.props.width,
      height: this.props.height
    }
    return <div style={style}>
      <Table
        rowHeight={50}
        rowsCount={this.props.representatives.length}
        width={this.props.width}
        height={this.props.height}
        groupHeaderHeight={40}
        headerHeight={40}
        onColumnResizeEndCallback={this._onColumnResizeEndCallback}
        isColumnResizing={false}
        onRowClick={(e, rowIndex) => InsightActions.selectGroup(rowIndex)}>
        {ColumnGroupsJSX}
      </Table>;
    </div>
  }
});

var InsightSimilarityGroupViewSequence = React.createClass({

  getInitialState: function() {
    return {
      indexColumnWidth: 200,
    };
  },

  _onColumnResizeEndCallback: function(newColumnWidth, columnKey) {
    this.setState({indexColumnWidth: newColumnWidth});
  },

  render: function() {
    //TODO(cuong): thoughts on of length? its pretty verbose.
    var columnGroupHeader = 'Exploring Group ' + this.props.groupIndex[1]; // + ' of length ' + this.props.groupIndex[0];
    var ColumnGroupsJSX =
          <ColumnGroup
            header={<TableHeader title={columnGroupHeader} icon={"toggle-on"} />}>
            <Column
              columnKey="index"
              header={<Cell>Index</Cell>}
              cell={<NameCell data={this.props.groupSequenceList}
                              selectedIndex={this.props.groupSequenceSelectedIndex}/>}
              width={this.state.indexColumnWidth}
              isResizable={true}
            />
            <Column
              header={<Cell>Time Series</Cell>}
              cell={<MultiTimeSeriesChartCell data={this.props.groupSequenceList}
                                              selectedIndex={this.props.groupSequenceSelectedIndex} />}
              width={0}
              flexGrow={1}
            />
          </ColumnGroup>;
    var style = {
      width: this.props.width,
      height: this.props.height
    }
    return <div style={style}>
      <Table
        rowHeight={50}
        rowsCount={this.props.groupSequenceList.length}
        width={this.props.width}
        height={this.props.height}
        groupHeaderHeight={40}
        headerHeight={40}
        scrollToRow={this.props.groupSequenceSelectedIndex}
        onColumnResizeEndCallback={this._onColumnResizeEndCallback}
        isColumnResizing={false}
        onRowClick={(e, rowIndex) => {
          InsightActions.selectGroupSequence(rowIndex);
          InsightActions.loadGroupSequence();
        }}>
        {ColumnGroupsJSX}
      </Table>;
    </div>
  }
});

var TableHeader = React.createClass({
  render: function() {
    var style = {
      wrapper: {
        padding: 0,
        margin: 0,
        width: '100%'
      },
      title: {
        padding: 0,
        paddingLeft: 10,
        margin: 0,
        padding: 0,
        display: 'inline'
      },
      icon: {
        position: 'absolute',
        textAlign: 'right',
        padding: 7,
        right: 0
      }
    }

    var iconClassName = "fa fa-"+ this.props.icon + " fa-1.5x";

    <i class="fa fa-toggle-off" aria-hidden="true"></i>

    var headerJSX =
      <div style={style.wrapper}>
        <h4 style={style.title} className={'dataTableLeft'}>
          {this.props.title}
          <span style={style.icon}>
            <i className={iconClassName} style={style.icon} onClick ={(e) => InsightActions.toggleGroupView()} ></i>
          </span>
        </h4>
      </div>;

    return headerJSX;
  }
})

module.exports = InsightSimilarityGroupView;
