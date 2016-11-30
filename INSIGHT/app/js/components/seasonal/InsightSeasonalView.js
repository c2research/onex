var React = require('react');
var InsightConstants = require('./../../flux/constants/InsightConstants');
var InsightActions = require('./../../flux/actions/InsightActions');
var MultiTimeSeriesChart = require('./../charts/MultiTimeSeriesChart');
var AnnotatedSlider = require('./../AnnotatedSlider');

/**
 * This is a prototype for an initial view
 */
var InsightSeasonalView = React.createClass({

  render: function() {
    var width = this.props.width;
    var height = this.props.height;
    var values = this.props.seasonalQueryInfo.qValues;
    var patterns = this.props.results.patterns;
    var showingPatternIndex = this.props.results.showingPatternIndex;

    var margins = {left: 35, right: 15, top: 20, bottom: 20};

    var data = this._buildData();

    var seasonalGraphJXS = <MultiTimeSeriesChart
                            margins={margins}
                            width={width - margins.left - margins.right}
                            height={height / 3}
                            data={data}
                            strokeWidth={3}
                           />;

    var patternSelector = patterns && (patterns.length > 1) &&
                          <PatternSelector
                            max={patterns.length - 1}
                            width={300}
                            min={0}
                            value={showingPatternIndex}
                          />;

    var viewAreaStyle = {
      width: width,
      height: height,
      marginLeft: this.props.marginLeft
    };

    var selectorStyle = {
      width: 300,
      marginLeft: 'auto',
      marginRight: 'auto'
    };

    return <div className='insightView' style={viewAreaStyle}>
      {seasonalGraphJXS}
      <div style={selectorStyle}>
        {patternSelector}
      </div>
    </div>;
  },

  _buildData: function() {
    var values = this.props.seasonalQueryInfo.qValues;
    var data = {
      series: [{ values: values, strokeWidth: 2 }],
      domains: { x: [0, values.length], y: [0, 1]},
    }

    var showingPatternIndex = this.props.results.showingPatternIndex;
    var currentPattern = this.props.results.patterns[showingPatternIndex];
    if (currentPattern) {
      for (var i = 0; i < currentPattern.length; i++) {
        var begin = currentPattern[i][0];
        var end = currentPattern[i][1];
        var currentColor = i % 2 == 0 ? 'blue' : 'green';
        data.series.push({ values: values.slice(begin, end + 1), strokeWidth: 5, color: currentColor});
      }
    }

    return data;
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
    InsightActions.selectSeasonalPatternIndex(parseInt(e.target.value), 10);
  }
})

module.exports = InsightSeasonalView;
