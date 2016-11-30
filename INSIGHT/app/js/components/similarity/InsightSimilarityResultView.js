var React = require('react');
var InsightConstants = require('./../../flux/constants/InsightConstants');
var InsightMenuBar = require('./InsightMenuBar');

var MultiTimeSeriesChart = require('./../charts/MultiTimeSeriesChart');
var TimeSeriesDifferenceChart = require('./../charts/TimeSeriesDifferenceChart');
var ConnectedScatterPlot = require('./../charts/ConnectedScatterPlot');
var RadialChart = require('./../charts/RadialChart');

var InsightSimilarityResultView = React.createClass({

  render: function() {
    var height = this.props.height;
    var width = this.props.width;
    var graphType = this.props.graphType;
    var dtwBias = this.props.dtwBias;
    var menuWidth = 40;
    var graphWidth = this.props.width - menuWidth - 10;

    var InsightMenuBarJSX =
      <InsightMenuBar
        width={menuWidth}
        height={height}
        dtwBias={dtwBias}
        graphType={graphType}
        resultSelected={this.props.selectedMatch !== null}
       />;

    var GraphJSX = this.generateGraph(graphWidth, height);

    var style = {
      width: width, 
      overflow: 'hidden',
      borderLeft: '1px dashed gray',
      borderBottom: '1px dashed gray'
    };
    return (
      <div style={style}>
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
    var alignedSelectedMatchValues = selectedMatch.getValues().map(function(x) { 
      return [x[0] - (selectedMatch.getStart() - selectedSubsequence.getStart()), x[1]]; 
    });
    var data = {};
    var margins = {left: 35, right: 15, top: 40, bottom: 20};
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
          warpingPath: this.props.warpingPath,
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
          series: [{ values: selectedSubsequence.getValues(), color: '#e2b6b3'},
                   { values: biasedMatchValues, color: bias == 0 ? 'green' : 'magenta'}],
          domains: { x: commonXDomain, y: commonYDomain },
          warpingPath: this.props.warpingPath
        }
        resultGraph = this.generateMultiLineChart(data, margins, width, height, title);
        break;
      case InsightConstants.GRAPH_TYPE_LINE:
        data = {
          series: [{ values: selectedSubsequence.getValues(), color: '#e2b6b3'},
                   { values: alignedSelectedMatchValues, color: 'green'}],
          domains: { x: commonXDomain, y: commonYDomain },
        }
        resultGraph = this.generateMultiLineChart(data, margins, width, height, title);
        break;
      case InsightConstants.GRAPH_TYPE_RADIAL:
        data = {
          series: [{ values: selectedSubsequence.getValues(), color: '#e2b6b3'},
                   { values: alignedSelectedMatchValues, color: 'green'}],
          domains: { x: commonXDomain, y: commonYDomain },
        }
        resultGraph = this.generateRadialChart(data, margins, width, height, title);
        break;
      case InsightConstants.GRAPH_TYPE_SPLIT:
        data = {
          seriesQ: { values: selectedSubsequence.getValues(), color: '#e2b6b3'},
          seriesR: { values: selectedMatch.getValues(), color: 'green'},
          domainsQ: { x: [selectedSubsequence.getStart(), selectedSubsequence.getEnd()], y: commonYDomain },
          domainsR: { x: [selectedMatch.getStart(), selectedMatch.getEnd()], y: commonYDomain },
        };
        resultGraph = this.generateSplitChart(data, margins, width, height, title);
        break;
      case InsightConstants.GRAPH_TYPE_ERROR:
        data = {
          series: [{ values: selectedSubsequence.getValues() },
                   { values: alignedSelectedMatchValues }],
          warpingPath: this.props.warpingPath,
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
    var queryData = {
      series: [data.seriesQ],
      domains: data.domainsQ
    };
    var resultData = {
      series: [data.seriesR],
      domains: data.domainsR
    };
    var splitmargins = {left: 35, right: 15, top: 5, bottom: 20};

    return <div>
      <MultiTimeSeriesChart
        margins={margins}
        width={width - margins.left - margins.right}
        height={(height / 2) - margins.top - margins.bottom}
        data={queryData}
        strokeWidth={3}
        title={title}
      />
      <MultiTimeSeriesChart
        margins={splitmargins}
        width={width - margins.left - margins.right}
        height={(height / 2) - margins.top - margins.bottom}
        data={resultData}
        strokeWidth={3}
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
            color={'blue'}
            title={title} />;
  },

});

module.exports = InsightSimilarityResultView;
