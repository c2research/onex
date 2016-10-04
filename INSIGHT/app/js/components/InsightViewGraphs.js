var React = require('react');
var ReactDOM = require('react-dom');
var d3 = require('d3');
var InsightConstants = require('./../flux/constants/InsightConstants');

var LineChart = require('rd3').LineChart;
var AreaChart = require('rd3').AreaChart;

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
     var sub = {
       margins:  {left: 35, right: 15, top: 20, bottom: 20},
       domain: { x: [], y: [0,1] },
       yAxisTickCount: 5,
       data: this.props.qValues.slice(this.props.qStart, this.props.qEnd + 1)
     }

     var total = {
       margins:  {left: 35, right: 15, top: 20, bottom: 5},
       domain: { x: [0,this.props.qValues.length], y: [0,1] },
       yAxisTickCount: 1,
       xAxisTickCount: 1,
       data: this.props.qValues
     }

     var chartData = {
       sub: [],
       total: []
     };

     var subHeight = (4.0/5.0) * this.props.height - 30;
     var totalHeight = this.props.height - subHeight - 30;

     if (this.props.qValues.length > 0) {
        var wholeD = {
          name: "Whole Match",
          values: total.data,
          strokeWidth: 3,
          strokeOpacity: 1
        };

        // a hack to make colors the same!
        var wholeDPlaceholder = {
          name: "Whole Match",
          values: [{index:sub.data[0].index, value:0}],
          strokeWidth: 0,
          strokeOpacity: 0,
          circleRadius: 0
        };

        chartData.total.push(wholeD);
        chartData.sub.push(wholeDPlaceholder);
     }

     if (sub.data.length > 0) {
        var subData = {
          name: "Selected Subsequence",
          values:  sub.data,
          strokeWidth: 3,
          strokeOpacity: 1
        };

        chartData.sub.push(subData);
        chartData.total.push(subData);
     }

     if (this.props.viewingResults) {
       var resultSubsequence = {
         data: this.props.rValues //this.props.rValues.slice(this.props.rStart, this.props.rEnd + 1)
       }

       var resultD = {
         name: "Match",
         values:  resultSubsequence.data,
         strokeWidth: 4,
         strokeOpacity: 1
       };

       chartData.sub.push(resultD);
       chartData.total.push(resultD);
     }

     var style = {
       divider: {
         height: 15
       }
     }

     var subD3JSX = chartData != null ?
     <LineChart
       margins={sub.margins}
       legend={false}
       domain={sub.domain}
       colors={d3.scale.category10()}
       width= {this.props.width}
       height= {subHeight}
       yAxisTickCount= {sub.yAxisTickCount}
       data= {chartData.sub}
       xAccessor= {function(d){return d.index}}
       yAccessor= {function(d){return d.value}}
     /> : null;

     var totalD3JSX = chartData != null ?
     <LineChart
       margins={total.margins}
       legend={false}
       domain={total.domain}
       yAxisTickCount={total.yAxisTickCount}
       xAxisTickCount={total.xAxisTickCount}
       colors={d3.scale.category10()}
       width= {this.props.width}
       height= {totalHeight}
       data= {chartData.total}
       xAccessor= {function(d){return d.index}}
       yAccessor= {function(d){return d.value}}
     /> : null;

     return <div>
              {subD3JSX}
              <div style={style.divider}> </div>
              {totalD3JSX}
            </div>
   }
});

module.exports = InsightViewGraphs;
