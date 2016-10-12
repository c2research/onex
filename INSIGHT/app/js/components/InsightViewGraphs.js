var React = require('react');
var d3 = require('d3');
var InsightConstants = require('./../flux/constants/InsightConstants');
var MultiTimeSeriesChart = require('./charts/MultiTimeSeriesChart');

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

    if (this.props.qValues.length < 1) return null;

    var qValues = this.props.qValues;
    var qStart = this.props.qStart;
    var qEnd = this.props.qEnd;
    var qValuesSelection = qValues.slice(qStart, qEnd + 1);
    var rValues = this.props.rValues;
                                  
    var subHeight = (4.0/5.0) * this.props.height - 30;
    var totalHeight = this.props.height - subHeight - 30;
    var subMargins = {left: 35, right: 15, top: 20, bottom: 20};
    var totalMargins = {left: 35, right: 15, top: 5, bottom: 20};

    var subData = {
      series: [],
      domains: { x: [0, qValuesSelection.length], y: [0, 1]},
    }

    var totalData = {
      series: [],
      domains: { x: [0, qValues.length], y: [0,1] }
    }

    

    totalData.series.push({ values: qValues, color: 'black'});
    if (qValuesSelection.length > 0) {
      var offsetSelection = qValuesSelection[0][0];
      var selectionLeftAligned = qValuesSelection.map(function(x) { return [x[0] - offsetSelection, x[1]]});
      subData.series.push({ values: selectionLeftAligned, color: 'black'});
      totalData.series.push({ values: qValuesSelection, color: 'red'});
    }

    if (this.props.viewingResults) {
      var offsetResult = rValues[0][0];
      var resultLeftAligned = rValues.map(function(x) { return [x[0] - offsetResult, x[1]]});
      
      subData.series.push({ values: resultLeftAligned, color: 'green'});
      subData.domains.x = [0, Math.max(qValuesSelection.length, rValues.length)];
      totalData.series.push({values: rValues, color: 'green'});
      totalData.domains.x = [0, Math.max(qValues[qValues.length - 1][0], rValues[rValues.length - 1][0])]
    }

    var subD3JSX = <MultiTimeSeriesChart
                     margins={subMargins}
                     width={this.props.width - subMargins.left - subMargins.right}
                     height={subHeight - subMargins.top - subMargins.bottom}
                     data={subData}
                     strokeWidth={3}
                   />;

    var totalD3JSX = <MultiTimeSeriesChart
                       margins={totalMargins}
                       width={this.props.width - totalMargins.left - totalMargins.right}
                       height={totalHeight - totalMargins.top - totalMargins.bottom}
                       data={totalData}
                       strokeWidth={3}
                     />;

     return <div>
              {subD3JSX}
              {totalD3JSX}
            </div>
   }
});

module.exports = InsightViewGraphs;
