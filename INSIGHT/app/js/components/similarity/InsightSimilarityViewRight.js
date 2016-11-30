var React = require('react');
var InsightConstants = require('./../../flux/constants/InsightConstants');
var InsightSimilarityResultView = require('./InsightSimilarityResultView');
var InsightSimilarityPreview = require('./InsightSimilarityPreview');

var InsightSimilarityViewRight = React.createClass({
  render: function() {
    var style = {
      width: this.props.width
    }
    var dimensions = {
      width: this.props.width,
      height: this.props.height / 2
    }
    return (<div style={style}>
        <InsightSimilarityResultView {...this.props.resultViewData} {...dimensions}/>
        <InsightSimilarityPreview {...this.props.previewData} {...dimensions}/>
    </div>);
  }
});

module.exports = InsightSimilarityViewRight;
