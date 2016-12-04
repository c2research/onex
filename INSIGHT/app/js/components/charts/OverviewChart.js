var D3OverviewChart = require('./D3OverviewChart');
var React = require('react');
var ReactDOM = require('react-dom');

var OverviewChart = React.createClass({
  propTypes: {
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    margins: React.PropTypes.object,
    data: React.PropTypes.object,
    onBrushSelection: React.PropTypes.func,
    title: React.PropTypes.string
  },

  _recursiveEqualityCheck: function(fieldOld, fieldNew) {
    var type = typeof fieldOld;
    switch(type) {
      case 'string':
        return fieldOld === fieldNew;
        break;
      case 'object':
        var val;
        //array
        if (Object.prototype.toString.call( fieldOld ) === '[object Array]'){
          if (fieldOld.length != fieldNew.length) {
            return false;
          }
          for (var i = 0; i < fieldOld.length; i++){
            val = this._recursiveEqualityCheck(fieldOld[i], fieldNew[i]);
            if (!val) {
              return false;
            }
          }
          return true;
        } else {
          //dictionary
          try {
            var val;
            for (var f in fieldOld) {
              val = this._recursiveEqualityCheck(fieldOld[f], fieldNew[f]);
              if (!val){
                return false;
              }
            }
            return val;
          }
          catch(err) {
              console.log('failed to parse object for equality');
              return false;
          }
        }
      case 'number':
        return fieldOld === fieldNew;
        break;
      case 'boolean':
        return fieldOld === fieldNew;
        break;
      default:
        return true;
    }
  },
  // TODO(Cuong): consider this to be a mixin so that it can be reused in other charts
  _detectChangeAndUpdateNonDataProps: function(newNonDataProps) {
    var changed = false;
    for (var field in newNonDataProps) {
      if(!this._recursiveEqualityCheck(this.nonDataProps[field], newNonDataProps[field])) {
        changed = true;
        break;
      }
    }
    this.nonDataProps = newNonDataProps;
    return changed;
  },

  componentDidMount: function() {
    var el = ReactDOM.findDOMNode(this);
    this.d3OverviewChart = new D3OverviewChart();
    this.nonDataProps = {
      width: this.props.width,
      height: this.props.height,
      margins: this.props.margins,
      strokeWidth: this.props.strokeWidth,
      onBrushSelection: this.props.onBrushSelection,
      title: this.props.title
    }
    this.d3OverviewChart.create(el, this.nonDataProps, this.props.data);
  },
  componentDidUpdate: function() {
    var el = ReactDOM.findDOMNode(this);
    var nonDataProps = {
      width: this.props.width,
      height: this.props.height,
      margins: this.props.margins,
      strokeWidth: this.props.strokeWidth,
      onBrushSelection: this.props.onBrushSelection,
      title: this.props.title
    };
    if (this._detectChangeAndUpdateNonDataProps(nonDataProps)) {
      this.d3OverviewChart.destroy(el);
      this.d3OverviewChart.create(el, this.nonDataProps, this.props.data);
    } else {
      this.d3OverviewChart.update(el, this.props.data);
    }
  },

  componentWillUnmount: function() {
    var el = ReactDOM.findDOMNode(this);
    this.d3OverviewChart.destroy(el);
  },

  render: function() {
    //TODO(charlie) check if the className matters, and if so - change it safely
    return (
      <div className="MultiTimeSeriesChart"></div>
    )
  }
});

module.exports = OverviewChart;
