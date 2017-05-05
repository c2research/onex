var React = require('react');
var InsightConstants = require('./../../flux/constants/InsightConstants');
var InsightSimilarityGroupView = require('./InsightSimilarityGroupView');
var InsightSimilarityQueryView = require('./InsightSimilarityQueryView');

var InsightSimilarityViewLeft = React.createClass({
  propTypes: {
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    groupViewData: React.PropTypes.object,
    queryListViewData: React.PropTypes.object,
    metadata: React.PropTypes.object
  },

  render: function() {
    var dimensions = {
      width: this.props.width,
      height: this.props.height / 2
    }

    return (
      <div style={{height: this.props.height, width: this.props.width}}>
        <InsightSimilarityGroupView metadata={this.props.metadata}
                                    {...this.props.groupViewData}
                                    {...dimensions}/>

        <InsightSimilarityQueryView metadata={this.props.metadata}
                                    representativesSelectedIndex={this.props.groupViewData.representativesSelectedIndex}
                                    {...this.props.queryListViewData}
                                    {...dimensions}/>
      </div>);
  }
});

module.exports = InsightSimilarityViewLeft;
