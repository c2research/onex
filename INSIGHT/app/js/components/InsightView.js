var React = require('react');
var ReactDOM = require('react-dom');


// require `react-d3-core` for Chart component, which help us build a blank svg and chart title.
var Chart = require('react-d3-core').Chart;
// require `react-d3-basic` for Line chart component.
var LineChart = require('react-d3-basic').LineChart;

/**
 * This is a prototype for an initial view
 */
var InsightView = React.createClass({
   render: function() {

     //TODO: incorporate answer
     //var data =//this.props.result;
     var chartData = this.props.qValues;

     var margins = {left: 100, right: 100, top: 50, bottom: 50};
     var title = "Query" + this.props.qSeq;

      // chart series,
      // field: is what field your data want to be selected
      // name: the name of the field that display in legend
      // color: what color is the line


     var d3JSX = <LineChart
       width= {this.props.width}
       height= {this.props.height}
       data= {chartData}
       chartSeries= {chartSeries}
       x= {x}
     />;

     return <div className="containerD3"> {d3JSX} </div>
   }
});

// your x accessor
var x = function(d) {
 return d.index;
}

var chartSeries = [
{
   field: 'value',
   color: '#ff7f0e',
   style: {
     "strokeWidth": 2,
     "strokeOpacity": 1,
     "fillOpacity": 0.5
   }
  }
];

module.exports = InsightView;
