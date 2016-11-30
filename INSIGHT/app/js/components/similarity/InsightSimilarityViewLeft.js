var React = require('react');
var InsightConstants = require('./../../flux/constants/InsightConstants');
var InsightSimilarityGroupView = require('./InsightSimilarityGroupView');
var InsightSimilarityQueryView = require('./InsightSimilarityQueryView');

var InsightSimilarityViewLeft = React.createClass({
  render: function() {
    var style = {
      width: this.props.width
    }
    var dimensions = {
      width: this.props.width,
      height: this.props.height / 2
    }
    return (<div style={style}>
        <InsightSimilarityGroupView {...this.props.groupViewData} {...dimensions}/>
        <InsightSimilarityQueryView {...this.props.queryListViewData} {...dimensions}/>
    </div>);
  }
});

module.exports = InsightSimilarityViewLeft;
