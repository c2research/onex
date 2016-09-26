var React = require('react');
var ReactDOM = require('react-dom');
var d3 = require('d3');

// require `react-d3-core` for Chart component, which help us build a blank svg and chart title.
// require `react-d3-basic` for Line chart component.
var LineChart = require('rd3').LineChart;
var AreaChart = require('rd3').AreaChart;

// var Legend = require('react-d3-core').Legend;
// var Xaxis = require('react-d3-core').Xaxis;
// var Yaxis = require('react-d3-core').Yaxis;
// var Line = require('react-d3-basic').Line;
// var Xgrid = require('react-d3-core').Xgrid;
// var Ygrid = require('react-d3-core').Ygrid;


/**
 * This is a prototype for an initial view
 */
var InsightView = React.createClass({
   render: function() {
     if (this.props.qValues.length < 1) return null;

     var sub = {
       margins:  {left: 60, right: 25, top: 20, bottom: 20},
       domain: { x: [], y: [0,1] },
       data: this.props.qValues.slice(this.props.qStart, this.props.qEnd + 1)
     }

     var total = {
       margins:  {left: 60, right: 25, top: 20, bottom: 25},
       domain: { x: [0,this.props.qValues.length], y: [0,1] },
       yAxisTickCount: 3,
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
          strokeOpacity: 0
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

     if (this.props.result.length > 0) {
        var resultD = {
          name: "Match",
          values:  this.props.result,
          strokeWidth: 3,
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
       colors={d3.scale.category10()}
       width= {this.props.width}
       height= {totalHeight}
       data= {chartData.total}
       xAccessor= {function(d){return d.index}}
       yAccessor= {function(d){return d.value}}
     /> : null;

     return <div className="containerD3">
              {subD3JSX}
              <div style={style.divider}> </div>
              {totalD3JSX}
            </div>
   }
});

module.exports = InsightView;
