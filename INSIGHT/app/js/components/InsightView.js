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

     //TODO: incorporate answer
     //var data =//this.props.result;
     var chartData = [
       {
         name: "Query",
         values:  this.props.qValues,
         strokeWidth: 3,
         strokeOpacity: 1,
         strokeDashArray: "5,5",
         colors: '#ff7f0e'
       },
       {
         name: "Match",
         strokeWidth: 3,
         strokeOpacity: 1,
         values:  this.props.result,
         colors: "#aa32f1"
       }
	    ];
        
     var margins = {left: 45, right: 25, top: 35, bottom: 35};
     var title = this.props.qSeq != null ? "Query" + this.props.qSeq : "No Query Chosen";

      // chart series,
      // field: is what field your data want to be selected
      // name: the name of the field that display in legend
      // color: what color is the line

      // your x accessor
      var x = function(d) {
       return d.index;
      }

    //
	    // style: {
	    //  "strokeWidth": 2,
	    //"strokeOpacity": 1,
	    // "fillOpacity": 0.5
	    // }
    // var legendJSX = <Legend
    //     width= {this.props.width}
    //     chartSeries = {chartSeries}
    //     swatchShape= 'circle'
    //     legendPosition = 'right'
    //     offset = '200'
    //   />;

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
