var React = require('react');

var InsightSimilarityViewLeft = require('./InsightSimilarityViewLeft');
var InsightSimilarityViewRight = require('./InsightSimilarityViewRight');
var InsightConstants = require('./../../flux/constants/InsightConstants');

var InsightSimilarityView = React.createClass({

  render: function() {

    var divStyle = {
      width: this.props.width,
      height: this.props.height,
      marginLeft: this.props.marginLeft,
      overflow: 'scroll' 
    };
    var leftDimensions = {
      width: 0.4 * this.props.width,
      height: this.props.height
    };
    var rightDimensions = {
      width: 0.6 * this.props.width,
      height: this.props.height
    }
    var wrapperStyle = { overflow: 'scroll' };
    var floatStyle = { float: 'left' };

    return (
      <div className="insightView" style={divStyle}>
        <div style={wrapperStyle}>
          <div style={floatStyle}>
            <InsightSimilarityViewLeft groupViewData={this.props.groupViewData}
                                       queryListViewData={this.props.queryListViewData}
                                       {...leftDimensions}/>
          </div>
          <div style={floatStyle}>
            <InsightSimilarityViewRight resultViewData={this.props.resultViewData}
                                        previewData={this.props.previewData}
                                        {...rightDimensions}/>
          </div>
        </div>
      </div>);
   }
});

module.exports = InsightSimilarityView;
