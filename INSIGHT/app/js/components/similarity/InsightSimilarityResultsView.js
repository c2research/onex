var React = require('react');

var InsightConstants = require('./../../flux/constants/InsightConstants');
var InsightActions = require('./../../flux/actions/InsightActions');

var MultiTimeSeriesChart = require('./../charts/MultiTimeSeriesChart');
var TimeSeriesDifferenceChart = require('./../charts/TimeSeriesDifferenceChart');
var ConnectedScatterPlot = require('./../charts/ConnectedScatterPlot');
var RadialChart = require('./../charts/RadialChart');
var OverviewChart = require('./../charts/OverviewChart');
/**
 * This is a prototype for an initial view for the graphs
 */
var InsightSimilarityResultsView = React.createClass({
   render: function() {
   /*
      This component will organize the graphs and act as a factory for different
      graphs, creating them as the user requests the various view.

      If this.prop.viewingResults is true, then we are showing a results
      pair! (And thus should render the result).
    */

    //TODO(charlie): consider splitting this into the components
    // the jsx for the three charts
    var resultD3JSX, selectedD3JSX, overviewD3JSX;

    // DIMENSIONS && MARGINS
    var resultMargins, selectedMargins, overviewMargins,
        resultHeight, selectedHeight, overviewHeight;


    // the result is visible
    resultMargins = {left: 35, right: 15, top: 25, bottom: 20};
    selectedMargins = {left: 35, right: 15, top: 5, bottom: 20};
    overviewMargins = {left: 35, right: 15, top: 5, bottom: 35};
    resultHeight = (3.0/5.0) * this.props.height;
    selectedHeight = (1.0/5.0) * this.props.height; // - 30; (TODO(charlie): test this==)
    overviewHeight = (1.0/5.0) * this.props.height;

    //   // the result is not visible
    //   resultMargins = null;
    //   selectedMargins = {left: 35, right: 15, top: 25, bottom: 20};
    //   overviewMargins = {left: 35, right: 15, top: 5, bottom: 20};
    //   resultHeight = 0;
    //   selectedHeight = (1.0/2.0) * this.props.height; // - 30; (TODO(charlie): test this==)
    //   overviewHeight = (1.0/2.0) * this.props.height;
    // }

    // RANGES & SELECTIONS
    var viewStart = this.props.viewRange[0];
    var viewEnd = this.props.viewRange[1];

    var qValues = this.props.qValues;
    var qStart = this.props.qStart;
    var qEnd = this.props.qEnd;

    // THE TOP - result CHART
    var resultData = {
      series: [],
      domains: { x: [qStart, qEnd], y: [0, 1]},
    }
    if (this.props.viewingResults) {
      var resultTitle = 'Similarity Results';

      //only show if we're viewing results
      var resultQValuesSelection = qValues.slice(qStart, qEnd + 1);
      resultData.series.push({ values: resultQValuesSelection, color: '#e2b6b3'});
      var resultRValues = this.props.rValues;

      var biasQuery = 0;
      if (this.props.graphType == InsightConstants.GRAPH_TYPE_WARP){
        biasQuery = 0.05 * this.props.dtwBiasValue;
      }

      var biasedRValues = resultRValues.map(function(x) { return [x[0], x[1] + biasQuery]; });
      resultData.series.push({ values: biasedRValues, color: biasQuery == 0 ? 'green' : 'magenta'});
      resultData.domains.x = [Math.min(qStart, biasedRValues[0][0]), Math.max(qEnd, biasedRValues[biasedRValues.length - 1][0])];
      resultData.warpingPath = this.props.warpingPath;

      //overviewData.series.push({values: overviewRValues, color: 'green'});
      //overviewData.domains.x = [0, Math.max(qValues[qValues.length - 1][0], overviewRValues[overviewRValues.length - 1][0])]

      switch(this.props.graphType) {
        case InsightConstants.GRAPH_TYPE_CONNECTED:
          resultData.color = 'blue';
          resultData.strokeWidth = '1.5';
          resultData.domains.x = [0,1];
          resultD3JSX = this.generateConnectedScatterPlot(resultData, resultMargins, resultHeight, resultTitle);
          break;
        case InsightConstants.GRAPH_TYPE_HORIZON:
          //break;
        case InsightConstants.GRAPH_TYPE_WARP:
          resultD3JSX = this.generateMultiLineChart(resultData, resultMargins, resultHeight, resultTitle);
          break;
        case InsightConstants.GRAPH_TYPE_LINE:
          resultData.warpingPath = null;
          resultD3JSX = this.generateMultiLineChart(resultData, resultMargins, resultHeight, resultTitle);
          break;
        case InsightConstants.GRAPH_TYPE_RADIAL:
          resultD3JSX =  this.generateRadialChart(resultData, resultMargins, resultHeight, resultTitle);
          break;
        case InsightConstants.GRAPH_TYPE_SPLIT:
          resultData.warpingPath = null;
          resultD3JSX = this.generateSplitChart(resultData, resultMargins, resultHeight, resultTitle);
          break;
        case InsightConstants.GRAPH_TYPE_ERROR:
          resultD3JSX =  this.generateErrorChart(resultQValuesSelection, resultRValues, this.props.warpingPath, resultMargins, resultHeight, resultTitle);
          break;
        default:
          console.log('case: ', this.props.graphType);
      }

    } else {
      resultD3JSX = this.generateMultiLineChart(resultData, resultMargins, resultHeight, 'Find the Most Similar Time Series to View Results');
    }

    //THE MIDDLE - SELECTED CHART
    var selectedViewData = {
      series: [],
      domains: { x: [viewStart, viewEnd], y: [0, 1] },
    }
    var selectedQValues = qValues.slice(viewStart, viewEnd + 1);
    selectedViewData.series.push({values: selectedQValues, color: '#e2b6b3'});
    selectedD3JSX = this.generateMultiLineChart(selectedViewData, selectedMargins, selectedHeight, 'Selected Subesequence');

    //THE BOT - OVERVIEW CHART
    var overviewData = {
      series: [],
      domains: { x: [0, qValues.length], y: [0, 1] },
    }
    overviewData.series.push({values: qValues});
    overviewData.series.push({values: selectedQValues});
    overviewD3JSX = <OverviewChart
                       margins={overviewMargins}
                       width={this.props.width - overviewMargins.left - overviewMargins.right}
                       height={overviewHeight - overviewMargins.top - overviewMargins.bottom}
                       data={overviewData}
                       strokeWidth={3}
                       onBrushSelection={this._onViewPointSelectionOverview}
                       title={'Brush a Subesequence'}
                     />;
     return <div>
              {resultD3JSX}
              {selectedD3JSX}
              {overviewD3JSX}
            </div>
   },
   generateConnectedScatterPlot: function(resultData, resultMargins, resultHeight, title){
      return <ConnectedScatterPlot
                      margins={resultMargins}
                      width={this.props.width - resultMargins.left - resultMargins.right}
                      height={resultHeight - resultMargins.top - resultMargins.bottom}
                      data={resultData}
                      strokeWidth={3}
                      color={'green'}
                      title={title}
                    />;
   },
   generateMultiLineChart: function(resultData, resultMargins, resultHeight, title){
      return <MultiTimeSeriesChart
                      margins={resultMargins}
                      width={this.props.width - resultMargins.left - resultMargins.right}
                      height={resultHeight - resultMargins.top - resultMargins.bottom}
                      data={resultData}
                      strokeWidth={3}
                      title={title}
                    />;
   },
   generateRadialChart: function(resultData, resultMargins, resultHeight, title){
      return <RadialChart
                      margins={resultMargins}
                      width={this.props.width - resultMargins.left - resultMargins.right}
                      height={resultHeight - resultMargins.top - resultMargins.bottom}
                      strokeWidth={3}
                      data={resultData}
                      title={title}

              />;
   },
   generateSplitChart: function(resultData, resultMargins, resultHeight, title){
      var queryresultData = {
        series: [resultData.series[0]],
        domains: resultData.domains
      };
      var resultresultData = {
        series: (resultData.series.length > 1) && [resultData.series[1]] || [{ values: [], color: 'black'}],
        domains: resultData.domains
      };
      var splitResultMargins = {left: 35, right: 15, top: 5, bottom: 20};

      return <div>
        <MultiTimeSeriesChart
                        margins={resultMargins}
                        width={this.props.width - resultMargins.left - resultMargins.right}
                        height={(resultHeight / 2) - resultMargins.top - resultMargins.bottom}
                        data={queryresultData}
                        strokeWidth={3}
                        title={title}
                      />
        <MultiTimeSeriesChart
                        margins={splitResultMargins}
                        width={this.props.width - resultMargins.left - resultMargins.right}
                        height={(resultHeight / 2) - resultMargins.top - resultMargins.bottom}
                        data={resultresultData}
                        strokeWidth={3}
                      />
      </div>;
   },
   generateErrorChart: function(querySelection, result, warpingPath, resultMargins, resultHeight, title){
     var chartData = {
       series: [{values: querySelection}, {values: result}],
       warpingPath: warpingPath,
       maxDomainY: 0.2
     };

     return <TimeSeriesDifferenceChart width={this.props.width - resultMargins.left - resultMargins.right}
                                            height={resultHeight - resultMargins.top - resultMargins.bottom}
                                            margins={resultMargins}
                                            data={chartData}
                                            strokeWidth={1}
                                            color={'blue'}
                                            title={title} />
   },
   /**
    * selects the view to be the given range
    */
   _onViewPointSelectionOverview: function(range) {
     InsightActions.selectSimilarityViewPoints(range);
   }
});

module.exports = InsightSimilarityResultsView;
