var React = require('react');
var InsightConstants = require('./../../flux/constants/InsightConstants');
var InsightActions = require('./../../flux/actions/InsightActions');
var InsightMenuBarPreview = require('./InsightMenuBarPreview');
var MultiTimeSeriesChart = require('./../charts/MultiTimeSeriesChart');
var OverviewChart = require('./../charts/OverviewChart');

var InsightSimilarityPreview = React.createClass({
  render: function() {
    if (!this.props.previewSequence) {
      return null;
    }
    var height = this.props.height;
    var width = this.props.width;
    var menuWidth = 40;
    var graphWidth = this.props.width - menuWidth - 10;

    var InsightMenuBarPreviewJSX =
      <InsightMenuBarPreview
        width={menuWidth}
        height={height}
      />;

    var previewSequence = this.props.previewSequence;
    var previewRange = this.props.previewRange;
    var selectedSequence = previewSequence.getValues().slice(previewRange[0], previewRange[1] + 1);

    var selectedViewData = {
      series: [{ values: selectedSequence,
                 color: '#e2b6b3' }],
      domains: { x: previewRange, y: [0, 1] },
    };

    var selectedMargins = {left: 35, right: 20, top: 20, bottom: 20};
    var SelectedD3JSX = <MultiTimeSeriesChart
                          margins={selectedMargins}
                          width={graphWidth - selectedMargins.left - selectedMargins.right}
                          height={0.7 * height - selectedMargins.top - selectedMargins.bottom}
                          data={selectedViewData}
                          strokeWidth={3}
                          title={'Preview Query'}
                        />;

    var overviewData = {
      series: [{ values: previewSequence.getValues()}, { values: selectedSequence } ],
      domains: { x: [previewSequence.getStart(), previewSequence.getEnd()], y: [0, 1] },
    }
    var overviewMargins = {left: 35, right: 20, top: 5, bottom: 35};
    var OverviewD3JSX = <OverviewChart
                          margins={overviewMargins}
                          width={graphWidth - overviewMargins.left - overviewMargins.right}
                          height={0.3 * height - overviewMargins.top - overviewMargins.bottom}
                          data={overviewData}
                          strokeWidth={3}
                          onBrushSelection={(range) => InsightActions.selectPreviewRange(range)}
                          title={'Brush a Subsequence'}
                        />;

    var style = {
      height: height,
      width: width,
      overflow: 'hidden',
      borderLeft: '1px dashed gray'
    };
    return (
      <div style={style}>
        <div style={{float: 'left', width: graphWidth}}>
          {SelectedD3JSX}
          {OverviewD3JSX}
        </div>
        <div style={{float: 'right'}}>
          {InsightMenuBarPreviewJSX}
        </div>  
      </div>
    );
  }
});

module.exports = InsightSimilarityPreview;
