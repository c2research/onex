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
    metadata: React.PropTypes.object
  },

  render: function() {
    var height = this.props.height;
    var width = this.props.width;
    var graphType = this.props.graphType;
    var dtwBias = this.props.dtwBias;
    var menuWidth = 40;
    var graphWidth = this.props.width - menuWidth - 10;
    var contextHeight = 80;
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
      borderBottom: '1px solid #e6e6e6',
      position: 'relative'
    };

    var contextStyle = {
      width: graphWidth,
      height: contextHeight,
      fontSize: '0.9em',
      textAlign: 'center',
    }

    var context = this.generateContext(this.props.selectedSubsequence, this.props.selectedMatch, this.props.distance);

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
    var scaleX = this.props.metadata && this.props.metadata.scaleX;
    var denormalizeY = this.props.metadata && this.props.metadata.normalization;

    var selectedSubsequenceValues = selectedSubsequence.getValues(scaleX, denormalizeY);
    var selectedMatchValues = selectedMatch.getValues(scaleX, denormalizeY);
    var warpingPath = this.props.warpingPath;
    var alignedSelectedMatchValues = selectedMatchValues.map(function(x) {
      return [x[0] - (selectedMatch.getStart(scaleX) - selectedSubsequence.getStart(scaleX)), x[1]];
    });
    alignedSelectedMatchValues = alignedSelectedMatchValues || [];

    var metadata = this.props.metadata
    var data = {};
    var margins = {left: 60, right: 15, top: 35, bottom: 45};
    var title = 'Similarity Results';
    var resultGraph = null;

    var maxLength = Math.max(selectedSubsequence.getEnd(scaleX) - selectedSubsequence.getStart(scaleX),
                             selectedMatch.getEnd(scaleX) - selectedMatch.getStart(scaleX));
    var commonXDomain = [selectedSubsequence.getStart(scaleX), selectedSubsequence.getStart(scaleX) + maxLength];
    var commonYDomain = [Math.min(selectedMatch.getMin(denormalizeY), selectedSubsequence.getMin(denormalizeY)),
                         Math.max(selectedMatch.getMax(denormalizeY), selectedSubsequence.getMax(denormalizeY))];

    switch(this.props.graphType) {
      case InsightConstants.GRAPH_TYPE_CONNECTED:
        var x_title = this.props.selectedSubsequence ? this.props.selectedSubsequence.getName() : 'Selected Subsequence';
        var y_title = this.props.selectedMatch ? this.props.selectedMatch.getName() : 'Matched Subsequence';
        data = {
          series: [{ values: selectedSubsequenceValues },
                   { values: alignedSelectedMatchValues }],
          warpingPath: warpingPath,
          domains: { x: commonYDomain, y: commonYDomain },
          color: 'blue',
          strokeWidth: '1.5',
          labels: { x: x_title, y: y_title}
        };
        resultGraph = this.generateConnectedScatterPlot(data, margins, width, height, title);
        break;
      case InsightConstants.GRAPH_TYPE_WARP:
        var biasStep = (commonYDomain[1] - commonYDomain[0]) / 10;
        var bias = biasStep * this.props.dtwBias;
        var biasedMatchValues = alignedSelectedMatchValues.map(function(x) { return [x[0], x[1] + bias]});
        data = {
          series: [{ values: selectedSubsequenceValues, color: '#74a2cc', legend: 'query'},
                   { values: biasedMatchValues, color: bias == 0 ? 'green' : "#c05a53",
                     legend: bias == 0 ? 'match' : 'match (added bias = ' + bias.toFixed(2) + ')'}],
          domains: { x: commonXDomain, y: commonYDomain },
          warpingPath: warpingPath,
          labels: metadata && metadata.labels
        }
        resultGraph = this.generateMultiLineChart(data, margins, width, height, title);
        break;
      case InsightConstants.GRAPH_TYPE_LINE:
        data = {
          series: [{ values: selectedSubsequenceValues, color: '#74a2cc', legend: 'query'},
                   { values: alignedSelectedMatchValues, color: 'green', legend: 'match'}],
          domains: { x: commonXDomain, y: commonYDomain },
          labels: metadata && metadata.labels
        }
        resultGraph = this.generateMultiLineChart(data, margins, width, height, title);
        break;
      case InsightConstants.GRAPH_TYPE_RADIAL:
        data = {
          series: [{ values: selectedSubsequenceValues, color: '#74a2cc', legend: 'query'},
                   { values: alignedSelectedMatchValues, color: 'green', legend: 'match'}],
          domains: { x: commonXDomain, y: commonYDomain },
        }
        resultGraph = this.generateRadialChart(data, margins, width, height, title);
        break;
      case InsightConstants.GRAPH_TYPE_SPLIT:
        data = {
          seriesQ: { values: selectedSubsequenceValues, color: '#74a2cc', legend: 'query'},
          seriesR: { values: selectedMatchValues, color: 'green', legend: 'match'},
          domainsQ: { x: [selectedSubsequence.getStart(scaleX), selectedSubsequence.getEnd(scaleX)], y: commonYDomain },
          domainsR: { x: [selectedMatch.getStart(scaleX), selectedMatch.getEnd(scaleX)], y: commonYDomain },
          labels: metadata && metadata.labels
        };
        resultGraph = this.generateSplitChart(data, margins, width, height, title);
        break;
      case InsightConstants.GRAPH_TYPE_ERROR:
        data = {
          series: [{ values: selectedSubsequenceValues },
                   { values: alignedSelectedMatchValues }],
          warpingPath: warpingPath,
          maxDomainY: commonYDomain[1] - commonYDomain[0]
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
      domains: data.domainsQ,
      labels: data.labels
    };
    var resultData = {
      series: [data.seriesR],
      domains: data.domainsR,
      labels: data.labels
    };
    var marginsTop    = {left: 60, right: 15, top: 35, bottom: 45};
    var marginsBottom = {left: 60, right: 15, top: 25, bottom: 45}

    return <div>
      <MultiTimeSeriesChart
        margins={marginsTop}
        width={width - margins.left - margins.right}
        height={(height / 2) - margins.top - margins.bottom}
        data={queryData}
        strokeWidth={3}
        title={title}
        showLegend={true}
      />
      <MultiTimeSeriesChart
        margins={marginsBottom}
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

  generateContext: function(query, result, distance) {
    if (result !== null && query != null) {

      var style = {
        table: {
          color: '#333',
          borderCollapse: 'collapse',
          borderSpacing: 0,
          width: '100%'
        },
        tr: {
          border: '0',
          height: 25
        },
        th: {
          background: '#FAFAFA',
          texAlign: 'center'
        },

      }

      var queryName = query.getName();
      var querySeq = query.getSeq();
      var resultName = result.getName();
      var resultSeq = result.getSeq();

      var context =
        <table style={style.table}>
        <tbody>
          <tr>
          	<td>{'query:'}</td>
            <td>{queryName}</td>
            <td>{querySeq}</td>
            <td>{'['+ query.getStart() + ', ' + query.getEnd() + ']'}</td>
            <td rowSpan="2">{'dist: ' + distance.toFixed(3)}</td>
          </tr>
          <tr>
          	<td>{'result:'}</td>
            <td>{resultName}</td>
            <td>{resultSeq}</td>
            <td>{'['+ result.getStart() + ', ' + result.getEnd() + ']'}</td>
          </tr>
          </tbody>
        </table>

      return context;
    } else {
      return '';
    }
  }

});

module.exports = InsightSimilarityResultView;
