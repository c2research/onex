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

    var viewStart = this.props.viewRange[0];
    var viewEnd = this.props.viewRange[1];

    var qValues = this.props.qValues;
    var qStart = this.props.qStart;
    var qEnd = this.props.qEnd;

    var qValuesSelection = qValues.slice(viewStart, viewEnd + 1);
    //var qValuesSelection = qValues.slice(qStart, qEnd + 1);

    var rValues = this.props.rValues && this.props.rValues.filter(function(x) {
      return (x[0] >= viewStart && x[1] <= viewEnd);
    });

    var warpingPath = this.props.warpingPath;

    var subHeight = (4.0/5.0) * this.props.height - 30;
    var totalHeight = this.props.height - subHeight - 30;
    var subMargins = {left: 35, right: 15, top: 25, bottom: 20};
    var totalMargins = {left: 35, right: 15, top: 5, bottom: 20};

    var subData = {
      series: [],
      domains: { x: [viewStart, viewEnd], y: [0, 1]},
      //domains: { x: [qStart, qEnd], y: [0, 1]},
    }

    var totalData = {
      series: [],
      domains: { x: [0, qValues.length], y: [0, 1] },
      viewRange: this.props.viewRange
    }

    totalData.series.push({ values: qValues, color: 'black'});

    if (qValuesSelection.length > 0) {
      subData.series.push({ values: qValuesSelection, color: 'black'});
      totalData.series.push({ values: qValuesSelection, color: 'red'});
    }

    if (this.props.viewingResults) {
      //TODO(charlie) move this functionality elsewhere once the graph types are set up

      var biasQuery = 0;
      if (this.props.graphType == InsightConstants.GRAPH_TYPE_WARP){
        biasQuery = 0.05 * this.props.dtwBiasValue;
      }

      var biasedRValues = rValues.map(function(x) { return [x[0], x[1] + biasQuery]; });
      subData.series.push({ values: biasedRValues, color: biasQuery == 0 ? 'green' : 'magenta'});
      //subData.domains.x = [Math.min(qStart, rValues[0][0]), Math.max(qEnd, rValues[rValues.length - 1][0])];
      //subData.domains.
      subData.warpingPath = warpingPath;

      totalData.series.push({values: rValues, color: 'green'});
      totalData.domains.x = [0, Math.max(qValues[qValues.length - 1][0], rValues[rValues.length - 1][0])]
    }

    var subD3JSX, totalD3JSX;

    switch(this.props.graphType) {
      case InsightConstants.GRAPH_TYPE_CONNECTED:
        subData.color = 'blue';
        subData.strokeWidth = '1.5';
        subD3JSX = this.generateConnectedScatterPlot(subData, subMargins, subHeight);
        break;
      case InsightConstants.GRAPH_TYPE_HORIZON:
        //break;
      case InsightConstants.GRAPH_TYPE_WARP:
        subD3JSX = this.generateMultiLineChart(subData, subMargins, subHeight);
        break;
      case InsightConstants.GRAPH_TYPE_LINE:
        subData.warpingPath = null;
        subD3JSX = this.generateMultiLineChart(subData, subMargins, subHeight);
        break;
      case InsightConstants.GRAPH_TYPE_RADIAL:
        subD3JSX =  this.generateRadialChart(subData, subMargins, subHeight);
        break;
      case InsightConstants.GRAPH_TYPE_SPLIT:
        subData.warpingPath = null;
        subD3JSX = this.generateSplitChart(subData, subMargins, subHeight);
        break;
      case InsightConstants.GRAPH_TYPE_ERROR:
        subD3JSX =  this.generateErrorChart(qValuesSelection, rValues, warpingPath, subMargins, subHeight);
        break;
      default:
        console.log('case: ', this.props.graphType);
    }

    totalD3JSX = <OverviewChart
                       margins={totalMargins}
                       width={this.props.width - totalMargins.left - totalMargins.right}
                       height={totalHeight - totalMargins.top - totalMargins.bottom}
                       data={totalData}
                       strokeWidth={3}
                       onBrushSelection={this._onViewPointSelectionOverview}
                       viewRange={this.props.viewRange}
                     />;
     return <div>
              {subD3JSX}
              {totalD3JSX}
            </div>
   },
   generateConnectedScatterPlot: function(subData, subMargins, subHeight){
      return <ConnectedScatterPlot
                      margins={subMargins}
                      width={this.props.width - subMargins.left - subMargins.right}
                      height={subHeight - subMargins.top - subMargins.bottom}
                      data={subData}
                      strokeWidth={3}
                      color={'green'}
                    />;
   },
   generateMultiLineChart: function(subData, subMargins, subHeight){
      return <MultiTimeSeriesChart
                      margins={subMargins}
                      width={this.props.width - subMargins.left - subMargins.right}
                      height={subHeight - subMargins.top - subMargins.bottom}
                      data={subData}
                      strokeWidth={3}
                    />;
   },
   generateRadialChart: function(subData, subMargins, subHeight){
      return <RadialChart
                      margins={subMargins}
                      width={this.props.width - subMargins.left - subMargins.right}
                      height={subHeight - subMargins.top - subMargins.bottom}
                      strokeWidth={3}
                      data={subData}
              />;
   },
   generateSplitChart: function(subData, subMargins, subHeight){
      var querySubData = {
        series: [subData.series[0]],
        domains: subData.domains
      };
      var resultSubData = {
        series: (subData.series.length > 1) && [subData.series[1]] || [{ values: [], color: 'black'}],
        domains: subData.domains
      };

      return <div>
        <MultiTimeSeriesChart
                        margins={subMargins}
                        width={this.props.width - subMargins.left - subMargins.right}
                        height={(subHeight / 2) - subMargins.top - subMargins.bottom}
                        data={querySubData}
                        strokeWidth={3}
                      />
        <MultiTimeSeriesChart
                        margins={subMargins}
                        width={this.props.width - subMargins.left - subMargins.right}
                        height={(subHeight / 2) - subMargins.top - subMargins.bottom}
                        data={resultSubData}
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
