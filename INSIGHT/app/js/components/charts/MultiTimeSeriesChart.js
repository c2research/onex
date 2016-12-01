var D3MultiTimeSeriesChart = require('./D3MultiTimeSeriesChart');
var React = require('react');
var ReactDOM = require('react-dom');

var MultiTimeSeriesChart = React.createClass({
  propTypes: {
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    margins: React.PropTypes.object,
    data: React.PropTypes.object,
    showToolTip: React.PropTypes.bool,
    title: React.PropTypes.string
  },

  getDefaultProps: function() {
    return {
      showToolTip: true
    };
  },

  // TODO(Cuong): consider this to be a mixin so that it can be reused in other charts
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

  componentDidMount: function() {
    var el = ReactDOM.findDOMNode(this);
    this.d3MultiTimeSeriesChart = new D3MultiTimeSeriesChart();

    this.nonDataProps = {
      width: this.props.width,
      height: this.props.height,
      margins: this.props.margins,
      strokeWidth: this.props.strokeWidth,
      showToolTip: this.props.showToolTip,
      title: this.props.title
    }
    this.d3MultiTimeSeriesChart.create(el, this.nonDataProps, this.props.data);
  },

  componentDidUpdate: function() {
    var el = ReactDOM.findDOMNode(this);
    var nonDataProps = {
      width: this.props.width,
      height: this.props.height,
      margins: this.props.margins,
      strokeWidth: this.props.strokeWidth,
      title: this.props.title,
      showToolTip: this.props.showToolTip,
    };
    if (this._detectChangeAndUpdateNonDataProps(nonDataProps)) {
      this.d3MultiTimeSeriesChart.destroy(el);
      this.d3MultiTimeSeriesChart.create(el, this.nonDataProps, this.props.data);
    }
    else {
      this.d3MultiTimeSeriesChart.update(el, this.props.data);
    }
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
