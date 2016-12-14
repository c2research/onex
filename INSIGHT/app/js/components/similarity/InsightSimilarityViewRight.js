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
    metadata: React.PropTypes.object
  },

  render: function() {
    var resultProportion = 0.60;
    var resultDimensions = {
      width: this.props.width,
      height: this.props.height * resultProportion
    }
    var previewDimensions = {
      width: this.props.width,
      height: this.props.height * (1-resultProportion)
    }
    return (<div style={{height: this.props.height, width: this.props.width}}>
        <InsightSimilarityResultView metadata={this.props.metadata}
                                     {...this.props.resultViewData}
                                     {...resultDimensions}
                                     />
        <InsightSimilarityPreview metadata={this.props.metadata}
                                  {...this.props.previewData}
                                  {...previewDimensions}/>
    </div>);
  }
});

module.exports = InsightSimilarityViewRight;
