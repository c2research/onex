var D3TimeSeriesDifferenceChart = require('./D3TimeSeriesDifferenceChart');
var React = require('react');
var ReactDOM = require('react-dom');

var TimeSeriesDifferenceChart = React.createClass({
  propTypes: {
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    margins: React.PropTypes.object,
    data: React.PropTypes.object
  },

  componentDidMount: function() {
    var el = ReactDOM.findDOMNode(this);
    this.d3TimeSeriesDifferenceChart = new D3TimeSeriesDifferenceChart();
    this.d3TimeSeriesDifferenceChart.create(el, {
      width: this.props.width,
      height: this.props.height,
      margins: this.props.margins,
      color: this.props.color,
      strokeWidth: this.props.strokeWidth
    }, this.props.data);
  },

  componentDidUpdate: function() {
    var el = ReactDOM.findDOMNode(this);
    this.d3TimeSeriesDifferenceChart.update(el, this.props.data);
  },

  componentWillUnmount: function() {
    var el = ReactDOM.findDOMNode(this);
    this.d3TimeSeriesDifferenceChart.destroy(el);
  },

  render: function() {
    return (
      <div className="TimeSeriesDifferenceChart"></div>
    )
  }
});

module.exports = TimeSeriesDifferenceChart;