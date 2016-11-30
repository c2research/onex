var React = require('react');
var InsightConstants = require('./../../flux/constants/InsightConstants');
var InsightMenuBar = require('./InsightMenuBar');

var MultiTimeSeriesChart = require('./../charts/MultiTimeSeriesChart');
var TimeSeriesDifferenceChart = require('./../charts/TimeSeriesDifferenceChart');
var ConnectedScatterPlot = require('./../charts/ConnectedScatterPlot');
var RadialChart = require('./../charts/RadialChart');
var OverviewChart = require('./../charts/OverviewChart');

var InsightSimilarityResultView = React.createClass({

  render: function() {
    var graphType = this.props.graphType;
    var dtwBias = this.props.dtwBias;
    var menuWidth = 50;
    var graphWidth = this.props.width - menuWidth;
    var InsightMenuBarJSX =
      <InsightMenuBar
        width={menuWidth}
        height={this.props.height}
        {...this.props.resultViewData}
       />;

    var GraphJSX = this.generateGraph(graphWidth, this.props.height);

    return (
      <div style={{width: this.props.width}}>
        <div style={{float: 'left', width: graphWidth}}>
          {GraphJSX}
        </div>
        <div style={{float: 'right'}}>
          {InsightMenuBarJSX}
        </div>        
      </div>);
  },

  generateGraph: function(width, height) {
    var selectedSubsequence = this.props.selectedSubsequence;
    var selectedMatch = this.props.selectedMatch;
    var data = {};
    var margins = {left: 35, right: 15, top: 25, bottom: 20};
    var title = 'Similarity Results';
    var resultGraph = null;
    //data.domains.x = [Math.min(qStart, biasedRValues[0][0]), Math.max(qEnd, biasedRValues[biasedRValues.length - 1][0])];

    switch(this.props.graphType) {
      case InsightConstants.GRAPH_TYPE_CONNECTED:
        data = {
          series: [{ values: selectedSubsequence.getValues(), color: '#e2b6b3'}],
          domains: { x: [0, 1], y: [0, 1] },
          color: 'blue',
          strokeWidth: '1.5'
        };
        resultGraph = this.generateConnectedScatterPlot(data, margins, width, height, title);
        break;
      case InsightConstants.GRAPH_TYPE_WARP:
        var bias = 0.05 * this.props.dtwBias;
        var biasedMatchValues = selectedMatch.getValues().map(function(x) { return [x[0], x[1] + bias]});
        data = {
          series: [{ values: selectedSubsequence.getValues(), color: '#e2b6b3'},
                   { values: biasedMatchValues, color: bias == 0 ? 'green' : 'magenta'}],
          domains: { x: [], y: [0, 1] },
          warpingPath: this.props.warpingPath
        }
        resultGraph = this.generateMultiLineChart(data, margins, width, height, title);
        break;
      case InsightConstants.GRAPH_TYPE_LINE:
        data = {
          series: [{ values: selectedSubsequence.getValues(), color: '#e2b6b3'},
                   { values: selectedMatch.getValues(), color: 'green'}],
          domains: { x: [], y: [0, 1] },
        }
        resultGraph = this.generateMultiLineChart(data, margins, width, height, title);
        break;
      case InsightConstants.GRAPH_TYPE_RADIAL:
        data = {
          series: [{ values: selectedSubsequence.getValues(), color: '#e2b6b3'},
                   { values: selectedMatch.getValues(), color: 'green'}],
          domains: { x: [], y: [0, 1] },
        }
        resultGraph = this.generateRadialChart(data, margins, width, height, title);
        break;
      case InsightConstants.GRAPH_TYPE_SPLIT:
        data = {
          series: [{ values: selectedSubsequence.getValues(), color: '#e2b6b3'},
                   { values: selectedMatch.getValues(), color: 'green'}],
          domains: { x: [], y: [0, 1] },
        }
        resultGraph = this.generateSplitChart(data, margins, width, height, title);
        break;
      case InsightConstants.GRAPH_TYPE_ERROR:
        data = {
          series: [{ values: selectedSubsequence.getValues(), color: '#e2b6b3'},
                   { values: selectedMatch.getValues(), color: 'green'}],
          domains: { x: [], y: [0, 1] },
        }
        resultGraph =  this.generateErrorChart(resultQValuesSelection, resultRValues, this.props.warpingPath, margins, height, title);
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
            color={'green'}
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

    />;
  },

  generateSplitChart: function(data, margins, width, height, title){
    var querydata = {
      series: [data.series[0]],
      domains: data.domains
    };
    var resultdata = {
      series: (data.series.length > 1) && [data.series[1]] || [{ values: [], color: 'black'}],
      domains: data.domains
    };
    var splitmargins = {left: 35, right: 15, top: 5, bottom: 20};

    return <div>
      <MultiTimeSeriesChart
        margins={margins}
        width={width - margins.left - margins.right}
        height={(height / 2) - margins.top - margins.bottom}
        data={querydata}
        strokeWidth={3}
        title={title}
      />
      <MultiTimeSeriesChart
        margins={splitmargins}
        width={width - margins.left - margins.right}
        height={(height / 2) - margins.top - margins.bottom}
        data={resultdata}
        strokeWidth={3}
      />
    </div>;
   },

  generateErrorChart: function(querySelection, result, warpingPath, margins, width, height, title) {
    var chartData = {
      series: [{values: querySelection}, {values: result}],
      warpingPath: warpingPath,
      maxDomainY: 0.2
    };

    return <TimeSeriesDifferenceChart
            width={width - margins.left - margins.right}
            height={height - margins.top - margins.bottom}
            margins={margins}
            data={chartData}
            strokeWidth={1}
            color={'blue'}
            title={title} />
  },

});

module.exports = InsightSimilarityResultView;
