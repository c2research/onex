var React = require('react');
var InsightConstants = require('./../../flux/constants/InsightConstants');

var InsightSimilarityGroupView = React.createClass({
  render: function() {
    var style = {
      width: this.props.width,
      height: this.props.height
    }
    return <div style={style}> 'InsightSimilarityGroupView' </div>;
  }
});

module.exports = InsightSimilarityGroupView;
