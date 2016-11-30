var React = require('react');
var InsightConstants = require('./../../flux/constants/InsightConstants');
var InsightSimilarityResultsView = require('./InsightSimilarityResultsView');
var InsightSimilarityPreview = require('./InsightSimilarityPreview');
var InsightMenuBar = require('./InsightMenuBar');

var InsightSimilarityResultView = React.createClass({
  //TODO(cuong): I did not split up the data beyond this point
  render: function() {
    var style = {
      width: this.props.width
    }
    var menuWidth = 50;

    var InsightViewGraphJSX = null;
      // <InsightSimilarityResultsView
      //   {...this.props.resultViewData}
      //   width={this.props.width - menuWidth}
      //   height={this.props.height}
      // />;

    var InsightMenuBarJSX =
      <InsightMenuBar
        width={menuWidth}
        height={this.props.height}
        {...this.props.resultViewData}
       />;

    var wrapperStyle = {
      overflow: 'hidden'
    }
    var floatStyle = {
      float: 'left'
    }

    return (<div className="insightView" style={style}>
              <div style={wrapperStyle}>
                <div style={floatStyle}>
                  {InsightViewGraphJSX}
                </div>
                <div style={floatStyle}>
                  {InsightMenuBarJSX}
                </div>
              </div>
            </div>);
  }
});

module.exports = InsightSimilarityResultView;
