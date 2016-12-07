var D3RadialChart = require('./D3RadialChart');
var React = require('react');
var ReactDOM = require('react-dom');

var RadialChart = React.createClass({
  propTypes: {
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    strokeWidth: React.PropTypes.number,
    margins: React.PropTypes.object,
    data: React.PropTypes.object,
    title: React.PropTypes.string,
    showLegend: React.PropTypes.bool
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
      strokeWidth: this.props.strokeWidth,
      title: this.props.title,
      showLegend: this.props.showLegend
    };
  },

  componentDidMount: function() {
    var el = ReactDOM.findDOMNode(this);
    this.d3RadialChart = new D3RadialChart();
    this.nonDataProps = this._getNonDataProps();
    this.d3RadialChart.create(el, this.nonDataProps, this.props.data);
  },

  componentDidUpdate: function() {
    var el = ReactDOM.findDOMNode(this);
    var nonDataProps = this._getNonDataProps();
    if (this._detectChangeAndUpdateNonDataProps(nonDataProps)) {
      this.d3RadialChart.destroy(el);
      this.d3RadialChart.create(el, this.nonDataProps, this.props.data);
    }
    else {
      this.d3RadialChart.update(el, this.props.data);
    }
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
