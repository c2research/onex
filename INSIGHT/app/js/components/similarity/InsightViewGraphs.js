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
var InsightViewGraphs = React.createClass({
   render: function() {
     /*
        This component will organize the graphs and act as a factory for different
        graphs, creating them as the user requests the various view.

        If this.prop.viewingResults is true, then we are showing a results
        pair! (And thus should render the result).
      */

    //TODO(charlie): clean this up (a lot). logic has become, not the best.

    // VARIABLES
    var viewStart = this.props.viewRange[0];
    var viewEnd = this.props.viewRange[1];

    var qValues = this.props.qValues;
    var qStart = this.props.qStart;
    var qEnd = this.props.qEnd;

    // THE TOP - DETAIL CHART

    var detailQViewValuesSelection = qValues.slice(viewStart, viewEnd + 1);
    var detailQSelectedValuesSelection = qValues.slice(qStart, qEnd + 1);

    //only show match on the top that is in view.
    var detailRValues = this.props.rValues && this.props.rValues.filter(function(x) {
      return (x[0] >= viewStart && x[0] < viewEnd);
    });

    //take only those which are in the current view
    var detailWarpingPath = this.props.warpingPath && this.props.warpingPath.filter(function(x) {
      return (x[0] >= viewStart && x[0] < viewEnd) && (x[1] >= viewStart && x[1] < viewEnd);
    });
    //shift them to mark appropriate points
    detailWarpingPath = this.props.warpingPath && detailWarpingPath.map(function(x) {
      return [x[0]-viewStart, x[1]-viewStart];
    });

    //THE BOT - OVERVIEW CHART
    var overviewRValues = this.props.rValues;

    // DIMENSIONS && MARGINS

    var subHeight = (4.0/5.0) * this.props.height - 30;
    var totalHeight = this.props.height - subHeight - 30;
    var subMargins = {left: 35, right: 15, top: 25, bottom: 20};
    var totalMargins = {left: 35, right: 15, top: 5, bottom: 20};

    var detailData = {
      series: [],
      domains: { x: [viewStart, viewEnd], y: [0, 1]},
      //domains: { x: [qStart, qEnd], y: [0, 1]},
    }

    var overviewData = {
      series: [],
      domains: { x: [0, qValues.length], y: [0, 1] },
      viewRange: [viewStart, viewEnd]
    }

    overviewData.series.push({ values: qValues, color: 'black'});

    if (detailQViewValuesSelection.length > 0) {
      detailData.series.push({ values: detailQViewValuesSelection, color: 'black'});
      overviewData.series.push({ values: detailQViewValuesSelection, color: 'red'});
    }


    if (this.props.viewingResults) {
      //TODO(charlie) move this functionality elsewhere once the graph types are set up

      var biasQuery = 0;
      if (this.props.graphType == InsightConstants.GRAPH_TYPE_WARP){
        biasQuery = 0.05 * this.props.dtwBiasValue;
      }
      var biasedRValues = detailRValues.map(function(x) { return [x[0], x[1] + biasQuery]; });
      detailData.series.push({ values: biasedRValues, color: biasQuery == 0 ? 'green' : 'magenta'});
      //detailData.domains.x = [Math.min(qStart, rValues[0][0]), Math.max(qEnd, rValues[rValues.length - 1][0])];
      //detailData.domains.
      detailData.warpingPath = detailWarpingPath;

      overviewData.series.push({values: overviewRValues, color: 'green'});
      overviewData.domains.x = [0, Math.max(qValues[qValues.length - 1][0], overviewRValues[overviewRValues.length - 1][0])]
    }

    var subD3JSX, totalD3JSX;

    switch(this.props.graphType) {
      case InsightConstants.GRAPH_TYPE_CONNECTED:
        detailData.color = 'blue';
        detailData.strokeWidth = '1.5';
        subD3JSX = this.generateConnectedScatterPlot(detailData, subMargins, subHeight);
        break;
      case InsightConstants.GRAPH_TYPE_HORIZON:
        //break;
      case InsightConstants.GRAPH_TYPE_WARP:
        subD3JSX = this.generateMultiLineChart(detailData, subMargins, subHeight);
        break;
      case InsightConstants.GRAPH_TYPE_LINE:
        detailData.warpingPath = null;
        subD3JSX = this.generateMultiLineChart(detailData, subMargins, subHeight);
        break;
      case InsightConstants.GRAPH_TYPE_RADIAL:
        subD3JSX =  this.generateRadialChart(detailData, subMargins, subHeight);
        break;
      case InsightConstants.GRAPH_TYPE_SPLIT:
        detailData.warpingPath = null;
        subD3JSX = this.generateSplitChart(detailData, subMargins, subHeight);
        break;
      case InsightConstants.GRAPH_TYPE_ERROR:
        subD3JSX =  this.generateErrorChart(detailQSelectedValuesSelection, detailRValues, detailWarpingPath, subMargins, subHeight);
        break;
      default:
        console.log('case: ', this.props.graphType);
    }

    totalD3JSX = <OverviewChart
                       margins={totalMargins}
                       width={this.props.width - totalMargins.left - totalMargins.right}
                       height={totalHeight - totalMargins.top - totalMargins.bottom}
                       data={overviewData}
                       strokeWidth={3}
                       onBrushSelection={this._onViewPointSelectionOverview}
                       viewRange={this.props.viewRange}
                     />;
     return <div>
              {subD3JSX}
              {totalD3JSX}
            </div>
   },
   generateConnectedScatterPlot: function(detailData, subMargins, subHeight){
      return <ConnectedScatterPlot
                      margins={subMargins}
                      width={this.props.width - subMargins.left - subMargins.right}
                      height={subHeight - subMargins.top - subMargins.bottom}
                      data={detailData}
                      strokeWidth={3}
                      color={'green'}
                    />;
   },
   generateMultiLineChart: function(detailData, subMargins, subHeight){
      return <MultiTimeSeriesChart
                      margins={subMargins}
                      width={this.props.width - subMargins.left - subMargins.right}
                      height={subHeight - subMargins.top - subMargins.bottom}
                      data={detailData}
                      strokeWidth={3}
                    />;
   },
   generateRadialChart: function(detailData, subMargins, subHeight){
      return <RadialChart
                      margins={subMargins}
                      width={this.props.width - subMargins.left - subMargins.right}
                      height={subHeight - subMargins.top - subMargins.bottom}
                      strokeWidth={3}
                      data={detailData}
              />;
   },
   generateSplitChart: function(detailData, subMargins, subHeight){
      var querydetailData = {
        series: [detailData.series[0]],
        domains: detailData.domains
      };
      var resultdetailData = {
        series: (detailData.series.length > 1) && [detailData.series[1]] || [{ values: [], color: 'black'}],
        domains: detailData.domains
      };

      return <div>
        <MultiTimeSeriesChart
                        margins={subMargins}
                        width={this.props.width - subMargins.left - subMargins.right}
                        height={(subHeight / 2) - subMargins.top - subMargins.bottom}
                        data={querydetailData}
                        strokeWidth={3}
                      />
        <MultiTimeSeriesChart
                        margins={subMargins}
                        width={this.props.width - subMargins.left - subMargins.right}
                        height={(subHeight / 2) - subMargins.top - subMargins.bottom}
                        data={resultdetailData}
                        strokeWidth={3}
                      />
      </div>;
   },
   generateErrorChart: function(querySelection, result, warpingPath, subMargins, subHeight){
     var chartData = {
       series: [{values: querySelection}, {values: result}],
       warpingPath: warpingPath,
       maxDomainY: 0.2
     };

     return <TimeSeriesDifferenceChart width={this.props.width - subMargins.left - subMargins.right}
                                            height={subHeight - subMargins.top - subMargins.bottom}
                                            margins={subMargins}
                                            data={chartData}
                                            strokeWidth={1}
                                            color={'blue'} />
   },
   /**
    * selects the view to be the given range
    */
   _onViewPointSelectionOverview: function(range) {
     InsightActions.selectSimilarityViewPoints(range);
   }
});

module.exports = InsightViewGraphs;
