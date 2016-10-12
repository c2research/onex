var D3MultiTimeSeriesChart = require('./D3MultiTimeSeriesChart');
var React = require('react');
var ReactDOM = require('react-dom');

var MultiTimeSeriesChart = React.createClass({
  propTypes: {
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    margins: React.PropTypes.object,
    data: React.PropTypes.object
  },

  componentDidMount: function() {
    var el = ReactDOM.findDOMNode(this);
    this.d3MultiTimeSeriesChart = new D3MultiTimeSeriesChart();
    this.d3MultiTimeSeriesChart.create(el, {
      width: this.props.width,
      height: this.props.height,
      margins: this.props.margins
    }, this.props.data);
  },

  componentDidUpdate: function() {
    var el = ReactDOM.findDOMNode(this);
    this.d3MultiTimeSeriesChart.update(el, this.props.data);
  },

  componentWillUnmount: function() {
    var el = ReactDOM.findDOMNode(this);
    this.d3MultiTimeSeriesChart.destroy(el);
  },

  render: function() {
    return (
      <div className="MultiTimeSeriesChart"></div>
    )
  }
});

module.exports = MultiTimeSeriesChart;