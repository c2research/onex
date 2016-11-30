var React = require('react');

var InsightSimilarityViewLeft = require('./InsightSimilarityViewLeft');
var InsightSimilarityViewRight = require('./InsightSimilarityViewRight');
var InsightConstants = require('./../../flux/constants/InsightConstants');

var InsightSimilarityView = React.createClass({

  render: function() {

    var divStyle = {
      width: this.props.width,
      height: this.props.height,
      marginLeft: this.props.marginLeft
    }

    var subDimensions = {
      width: this.props.width / 2,
      height: this.props.height
    }

    var wrapperStyle = {
      overflow: 'hidden'
    }
    var floatStyle = {
      float: 'left'
    }

    return (
    <div className="insightView" style={divStyle}>
      <div style={wrapperStyle}>
        <div style={floatStyle}>
          <InsightSimilarityViewLeft groupViewData={this.props.groupViewData}
                                     queryListViewData={this.props.queryListViewData}
                                     {...subDimensions}/>
        </div>
        <div style={floatStyle}>
          <InsightSimilarityViewRight resultViewData={this.props.resultViewData}
                                      previewData={this.props.previewData}
                                      {...subDimensions}/>
        </div>
      </div>
    </div> );
   }
});

module.exports = InsightSimilarityView;
