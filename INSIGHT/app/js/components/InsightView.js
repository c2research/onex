var React = require('react');
var ReactDOM = require('react-dom');
var d3 = require('d3');

// require `react-d3-core` for Chart component, which help us build a blank svg and chart title.
// require `react-d3-basic` for Line chart component.
var LineChart = require('rd3').LineChart;

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

     var preSub = this.props.qValues.slice(0, this.props.qStart + 1);
     var postSub = this.props.qValues.slice(this.props.qEnd - 1);
     var sub = this.props.qValues.slice(this.props.qStart - 1, this.props.qEnd + 1);

     console.log(preSub, postSub, sub);

     var chartData = [
       {
         name: "Before Subsequence",
         values:  preSub,
         strokeWidth: 2,
         strokeOpacity: 0.7,
         strokeDashArray: "5,5"
       },
       {
         name: "Selected Subsequence",
         values:  sub,
         strokeWidth: 3,
         strokeOpacity: 1,
       },
       {
         name: "After Subsequence",
         values:  postSub,
         strokeWidth: 2,
         strokeOpacity: 0.7,
       },

       {
         name: "Match",
         strokeWidth: 3,
         strokeOpacity: 1,
         values:  this.props.result
       }
	    ];

      var chartData = [];

      //we're gonna draw the whole thing, and then color the start and end
      chartData.push({
        values:  this.props.qValues,
        strokeWidth: 2,
        strokeOpacity: 0.7
      });


      if (preSub.length > 0) {
        chartData.push({
          values:  preSub,
          strokeWidth: 2,
          strokeOpacity: 0.7
        });
      }
      // if (sub.length > 0) {
      //   chartData.push({
      //     name: "Selected Subsequence",
      //     values:  sub,
      //     strokeWidth: 3,
      //     strokeOpacity: 1,
      //   });
      // }
      if (postSub.length > 0) {
        chartData.push({
          values:  postSub,
          strokeWidth: 2,
          strokeOpacity: 0.7
        });
      }
      if (this.props.result.length > 0) {
        chartData.push({
          name: "Match",
          strokeWidth: 3,
          strokeOpacity: 1,
          values:  this.props.result
        });
      }

     var margins = {left: 60, right: 25, top: 35, bottom: 35};

    var
       xLabel = "Data",
       yLabel = "Time",
       yTicks = [0.1],
       yDomain = [0, 1.0];

     var d3JSX = chartData != null ? <LineChart
       margins={margins}
       legend={false}
       yDomain={yDomain}
       colors={d3.scale.category10()}
       width= {this.props.width}
       height= {this.props.height}
       data= {chartData}
       xAccessor= {function(d){return d.index}}
       yAccessor= {function(d){return d.value}}
     /> : null;

     return <div className="containerD3">{d3JSX}</div>
   }
});

module.exports = InsightView;
