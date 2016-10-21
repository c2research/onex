var React = require('react');
var InsightConstants = require('./../../flux/constants/InsightConstants');
var InsightActions = require('./../../flux/actions/InsightActions');
var MultiTimeSeriesChart = require('./../charts/MultiTimeSeriesChart');
var AnnotatedSlider = require('./../AnnotatedSlider');

/**
 * This is a prototype for an initial view
 */
var InsightViewSeasonal = React.createClass({
 
  render: function() {
    var width = this.props.width;
    var height = this.props.height;
    var values = this.props.seasonalQueryInfo.qValues;
    var patterns = this.props.results.patterns;
    var showingPatternIndex = this.props.results.showingPatternIndex;

    var margins = {left: 35, right: 15, top: 20, bottom: 20};

    var data = {
      series: [{ values: values, strokeWidth: 2 }],
      domains: { x: [0, values.length], y: [0, 1]},
    };

    var seasonalGraphJXS = <MultiTimeSeriesChart
                            margins={margins}
                            width={width - margins.left - margins.right}
                            height={height / 4}
                            data={data}
                            strokeWidth={3}
                           />

    if (patterns && patterns.length > 0) {
      var patternSelector = <PatternSelector
                              max={patterns.length - 1}
                              min={0}
                              value={showingPatternIndex}
                            />
    }

    var divStyle = {
      width: width,
      height: height,
      marginLeft: this.props.marginLeft
    }
    return <div className='insightView' style={divStyle}>
      {seasonalGraphJXS}
    </div>;
  }

});

var PatternSelector = React.createClass({
  render: function() {
    return <AnnotatedSlider 
            max={this.props.max}
            min={this.props.min}
            step={1}
            value={this.props.value}
            onChange={this._changeShowingPattern} />;
  },

  _changeShowingPattern: function(e) {
    clearTimeout(this._changeId);
    this._changeId = setTimeout(InsightActions.selectSeasonalPatternIndex(e.target.value), 100);
  }
})

module.exports = InsightViewSeasonal;
