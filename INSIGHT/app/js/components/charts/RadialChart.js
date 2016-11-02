var D3RadialChart = require('./D3RadialChart');
var React = require('react');
var ReactDOM = require('react-dom');

var RadialChart = React.createClass({
  propTypes: {
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    margins: React.PropTypes.object,
    data: React.PropTypes.object
  },

  componentDidMount: function() {
    var el = ReactDOM.findDOMNode(this);
    this.d3RadialChart = new D3RadialChart();
    this.d3RadialChart.create(el, {
      width: this.props.width,
      height: this.props.height,
      margins: this.props.margins
    }, this.props.data);
  },

  componentDidUpdate: function() {
    var el = ReactDOM.findDOMNode(this);
    this.d3RadialChart.update(el, this.props.data);
  },

  componentWillUnmount: function() {
    var el = ReactDOM.findDOMNode(this);
    this.d3RadialChart.destroy(el);
  },

  render: function() {
    return (
      <div className="radial-chart"></div>
    )
  }
});

module.exports = RadialChart;