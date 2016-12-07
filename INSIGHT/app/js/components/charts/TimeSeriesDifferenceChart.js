var D3TimeSeriesDifferenceChart = require('./D3TimeSeriesDifferenceChart');
var React = require('react');
var ReactDOM = require('react-dom');

var TimeSeriesDifferenceChart = React.createClass({
  propTypes: {
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    margins: React.PropTypes.object,
    color: React.PropTypes.string,
    data: React.PropTypes.object,
    title: React.PropTypes.string
  },

  _detectChangeAndUpdateNonDataProps: function(newNonDataProps) {
    var changed = false;
    for (var field in newNonDataProps) {
      if (this.nonDataProps[field] !== newNonDataProps[field]) {
        changed = true;
        break;
      }
    }
    this.nonDataProps = newNonDataProps;
    return changed;
  },

  _getNonDataProps: function() {
    return {
      width: this.props.width,
      height: this.props.height,
      margins: this.props.margins,
      color: this.props.color,
      strokeWidth: this.props.strokeWidth,
      title: this.props.title
    };
  },

  componentDidMount: function() {
    var el = ReactDOM.findDOMNode(this);
    this.d3TimeSeriesDifferenceChart = new D3TimeSeriesDifferenceChart();
    this.nonDataProps = this._getNonDataProps();
    this.d3TimeSeriesDifferenceChart.create(el, this.nonDataProps, this.props.data);
  },

  componentDidUpdate: function() {
    var el = ReactDOM.findDOMNode(this);
    var nonDataProps = this._getNonDataProps();
    if (this._detectChangeAndUpdateNonDataProps(nonDataProps)) {
      this.d3TimeSeriesDifferenceChart.destroy(el);
      this.d3TimeSeriesDifferenceChart.create(el, this.nonDataProps, this.props.data);
    }
    else {
      this.d3TimeSeriesDifferenceChart.update(el, this.props.data);
    }
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
