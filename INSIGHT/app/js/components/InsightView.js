var React = require('react');
var ReactDOM = require('react-dom');
var d3 = require('d3');

var InsightViewGraph = require('./InsightViewGraphs');
var InsightViewTable = require('./InsightViewTable');


var LineChart = require('rd3').LineChart;
var AreaChart = require('rd3').AreaChart;

/**
 * This is a prototype for an initial view
 */
var InsightView = React.createClass({
  render: function() {
    var InsightViewGraphJSX =
    <InsightViewGraph width={this.props.width}
                      height={this.props.height - 100}
                      qValues={this.props.qValues}
                      qSeq={this.props.qSeq}
                      qStart={this.props.qStart}
                      qEnd={this.props.qEnd}
                      result={this.props.result}/>
    var InsightViewTableJSX =
    <InsightViewTable width={this.props.width}
                      height={100}/>

     return (<div className="containerD3">
               {InsightViewGraphJSX}
               {InsightViewTableJSX}
             </div>);
   }
});

module.exports = InsightView;
