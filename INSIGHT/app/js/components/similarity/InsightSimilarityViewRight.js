var React = require('react');
var InsightConstants = require('./../../flux/constants/InsightConstants');
var InsightSimilarityResultView = require('./InsightSimilarityResultView');
var InsightSimilarityPreview = require('./InsightSimilarityPreview');

var InsightSimilarityViewRight = React.createClass({
  propTypes: {
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    resultViewData: React.PropTypes.object,
    previewData: React.PropTypes.object,
  },

  render: function() {
    var resultProportion = 0.55;
    var resultDimensions = {
      width: this.props.width,
      height: this.props.height * resultProportion
    }
    var previewDimensions = {
      width: this.props.width,
      height: this.props.height * (1-resultProportion)
    }
    return (<div style={{height: this.props.height, width: this.props.width}}>
        <InsightSimilarityResultView {...this.props.resultViewData} {...resultDimensions}/>
        <InsightSimilarityPreview {...this.props.previewData} {...previewDimensions}/>
    </div>);
  }
});

module.exports = InsightSimilarityViewRight;
