var React = require('react');
var InsightConstants = require('./../../flux/constants/InsightConstants');
var InsightMenuBarResult = require('./InsightMenuBarResult');
var TimeSeries = require('./../../TimeSeries');

var MultiTimeSeriesChart = require('./../charts/MultiTimeSeriesChart');
var TimeSeriesDifferenceChart = require('./../charts/TimeSeriesDifferenceChart');
var ConnectedScatterPlot = require('./../charts/ConnectedScatterPlot');
var RadialChart = require('./../charts/RadialChart');

var InsightSimilarityResultView = React.createClass({
  propTypes: {
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    queryLocation: React.PropTypes.string,
    graphType: React.PropTypes.string,
    dtwBias: React.PropTypes.number,
    selectedSubsequence: React.PropTypes.object,
    selectedMatch: React.PropTypes.object,
    warpingPath: React.PropTypes.array,
  },

  render: function() {
    var height = this.props.height;
    var width = this.props.width;
    var graphType = this.props.graphType;
    var dtwBias = this.props.dtwBias;
    var menuWidth = 40;
    var graphWidth = this.props.width - menuWidth - 10;
    var contextHeight = this.props.selectedMatch !== null ? 25 : 0;
    var graphHeight = height - contextHeight;

    var InsightMenuBarResultJSX =
      <InsightMenuBarResult
        width={menuWidth}
        height={height}
        dtwBias={dtwBias}
        graphType={graphType}
        resultSelected={this.props.selectedMatch !== null}
       />;

    var GraphJSX = this.generateGraph(graphWidth, graphHeight);

    var style = {
      height: height,
      width: width,
      overflow: 'hidden',
      borderLeft: '1px dashed gray',
      borderBottom: '1px dashed gray',
      position: 'relative'
    };

    var contextStyle = {
      width: graphWidth,
      height: contextHeight,
      fontSize: '0.9em',
      padding: 5,
      textAlign: 'center',
      position: 'absolute',
      left: 0,
      bottom: 0
    }

    var context = this.generateContext(this.props.selectedMatch);

    return (
      <div style={style}>
        <div style={{float: 'left', width: graphWidth}}>
          {GraphJSX}
          <div style={contextStyle}> {context} </div>
        </div>
        <div style={{float: 'right'}}>
           {InsightMenuBarResultJSX}
        </div>

      </div>);
  },

  generateGraph: function(width, height) {
    var selectedSubsequence = this.props.selectedSubsequence || new TimeSeries([], '', -1, 0, 0, 0);
    var selectedMatch = this.props.selectedMatch || new TimeSeries([], '', -1, 0, 0, 0);
    var warpingPath = this.props.warpingPath;
    // console.log(selectedSubsequence.getValues().map((x) => x[1]));
    // console.log(selectedMatch.getValues().map((x) => x[1]));
    // console.log(this.props.warpingPath);
    var alignedSelectedMatchValues = selectedMatch.getValues().map(function(x) {
      return [x[0] - (selectedMatch.getStart() - selectedSubsequence.getStart()), x[1]];
    });
    alignedSelectedMatchValues = alignedSelectedMatchValues || [];

    var data = {};
    var margins = {left: 35, right: 15, top: 35, bottom: 40};
    var title = 'Similarity Results';
    var resultGraph = null;
    var maxLength = Math.max(selectedSubsequence.getValues().length, selectedMatch.getValues().length);
    var commonXDomain = [selectedSubsequence.getStart(), selectedSubsequence.getStart() + maxLength];
    var commonYDomain = [0, 1];

    switch(this.props.graphType) {
      case InsightConstants.GRAPH_TYPE_CONNECTED:
        data = {
          series: [{ values: selectedSubsequence.getValues()},
                   { values: alignedSelectedMatchValues}],
          warpingPath: warpingPath,
          domains: { x: [0, 1], y: [0, 1] },
          color: 'blue',
          strokeWidth: '1.5'
        };
        resultGraph = this.generateConnectedScatterPlot(data, margins, width, height, title);
        break;
      case InsightConstants.GRAPH_TYPE_WARP:
        var bias = 0.05 * this.props.dtwBias;
        var biasedMatchValues = alignedSelectedMatchValues.map(function(x) { return [x[0], x[1] + bias]});
        data = {
          series: [{ values: selectedSubsequence.getValues(), color: '#74a2cc', legend: 'query'},
                   { values: biasedMatchValues, color: bias == 0 ? 'green' : "#c05a53", legend: 'match'}],
          domains: { x: commonXDomain, y: commonYDomain },
          warpingPath: warpingPath
        }
        resultGraph = this.generateMultiLineChart(data, margins, width, height, title);
        break;
      case InsightConstants.GRAPH_TYPE_LINE:
        data = {
          series: [{ values: selectedSubsequence.getValues(), color: '#74a2cc', legend: 'query'},
                   { values: alignedSelectedMatchValues, color: 'green', legend: 'match'}],
          domains: { x: commonXDomain, y: commonYDomain },
        }
        resultGraph = this.generateMultiLineChart(data, margins, width, height, title);
        break;
      case InsightConstants.GRAPH_TYPE_RADIAL:
        data = {
          series: [{ values: selectedSubsequence.getValues(), color: '#74a2cc', legend: 'query'},
                   { values: alignedSelectedMatchValues, color: 'green', legend: 'match'}],
          domains: { x: commonXDomain, y: commonYDomain },
        }
        resultGraph = this.generateRadialChart(data, margins, width, height, title);
        break;
      case InsightConstants.GRAPH_TYPE_SPLIT:
        data = {
          seriesQ: { values: selectedSubsequence.getValues(), color: '#74a2cc', legend: 'query'},
          seriesR: { values: selectedMatch.getValues(), color: 'green', legend: 'match'},
          domainsQ: { x: [selectedSubsequence.getStart(), selectedSubsequence.getEnd()], y: commonYDomain },
          domainsR: { x: [selectedMatch.getStart(), selectedMatch.getEnd()], y: commonYDomain },
        };
        resultGraph = this.generateSplitChart(data, margins, width, height, title);
        break;
      case InsightConstants.GRAPH_TYPE_ERROR:
        data = {
          series: [{ values: selectedSubsequence.getValues() },
                   { values: alignedSelectedMatchValues }],
          warpingPath: warpingPath,
          maxDomainY: 0.2
        };
        resultGraph =  this.generateErrorChart(data, margins, width, height, title);
        break;
      default:
        console.log('case: ', this.props.graphType);
    }

    return resultGraph;
  },

  generateConnectedScatterPlot: function(data, margins, width, height, title){
    return <ConnectedScatterPlot
            margins={margins}
            width={width - margins.left - margins.right}
            height={height - margins.top - margins.bottom}
            data={data}
            strokeWidth={3}
            color={'#74a2cc'}
            title={title}
          />;
  },

  generateMultiLineChart: function(data, margins, width, height, title){
    return <MultiTimeSeriesChart
            margins={margins}
            width={width - margins.left - margins.right}
            height={height - margins.top - margins.bottom}
            data={data}
            strokeWidth={3}
            showLegend={true}
            title={title}
          />;
  },

  generateRadialChart: function(data, margins, width, height, title){
    return <RadialChart
            margins={margins}
            width={width - margins.left - margins.right}
            height={height - margins.top - margins.bottom}
            strokeWidth={3}
            data={data}
            title={title}
            showLegend={true}
    />;
  },

  generateSplitChart: function(data, margins, width, height, title){
    var queryData = {
      series: [data.seriesQ],
      domains: data.domainsQ
    };
    var resultData = {
      series: [data.seriesR],
      domains: data.domainsR
    };
    var splitmargins = {left: 35, right: 15, top: 35, bottom: 20};

    return <div>
      <MultiTimeSeriesChart
        margins={splitmargins}
        width={width - margins.left - margins.right}
        height={(height / 2) - margins.top - margins.bottom}
        data={queryData}
        strokeWidth={3}
        title={title}
        showLegend={true}
      />
      <MultiTimeSeriesChart
        margins={splitmargins}
        width={width - margins.left - margins.right}
        height={(height / 2) - margins.top - margins.bottom}
        data={resultData}
        strokeWidth={3}
        showLegend={true}
      />
    </div>;
   },

  generateErrorChart: function(data, margins, width, height, title) {
    return <TimeSeriesDifferenceChart
            width={width - margins.left - margins.right}
            height={height - margins.top - margins.bottom}
            margins={margins}
            data={data}
            strokeWidth={1}
            color={'#74a2cc'}
            title={title} />;
  },

  generateContext: function(timeSeries) {
    if (timeSeries !== null) {
      var index = timeSeries.getSeq();
      var start = timeSeries.getStart();
      var end = timeSeries.getEnd();
      var dataset = timeSeries.getName();
      var context = 'matching subsequence: '+ index + 'th entry in ' + dataset + ', length ' + (end - start) + ' from indices ' + start + ' - ' + end;
      return context;
    } else {
      return '';
    }
  }

});

module.exports = InsightSimilarityResultView;
