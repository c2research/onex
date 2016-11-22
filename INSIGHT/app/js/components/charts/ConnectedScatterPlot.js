var D3ConnectedScatterPlot = require('./D3ConnectedScatterPlot');
var React = require('react');
var ReactDOM = require('react-dom');

var ConnectedScatterPlot = React.createClass({
  propTypes: {
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    margins: React.PropTypes.object,
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

  componentDidMount: function() {
    var el = ReactDOM.findDOMNode(this);
    this.d3ConnectedScatterPlot = new D3ConnectedScatterPlot();
    this.nonDataProps = {
      width: this.props.width,
      height: this.props.height,
      margins: this.props.margins,
      strokeWidth: this.props.strokeWidth,
      title: this.props.title
    }
    //what should it show with no warping path?
    this.d3ConnectedScatterPlot.create(el, this.nonDataProps, this.props.data);
  },

  componentDidUpdate: function() {
    var el = ReactDOM.findDOMNode(this);
    var nonDataProps = {
      width: this.props.width,
      height: this.props.height,
      margins: this.props.margins,
      strokeWidth: this.props.strokeWidth,
      title: this.props.title
    };
    if (this._detectChangeAndUpdateNonDataProps(nonDataProps)) {
      this.d3ConnectedScatterPlot.destroy(el);
      this.d3ConnectedScatterPlot.create(el, this.nonDataProps, this.props.data);
    }
    else {
      this.d3ConnectedScatterPlot.update(el, this.props.data);
    }
  },

  componentWillUnmount: function() {
    var el = ReactDOM.findDOMNode(this);
    this.d3ConnectedScatterPlot.destroy(el);
  },

  render: function() {
    return (
      <div className="MultiTimeSeriesChart"></div>
    )
  }
});

module.exports = ConnectedScatterPlot;
