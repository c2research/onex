var React = require('react');

/**
 * This dropdown will have all the datasets
 */
var InsightThresholdSlider = React.createClass({
   render: function() {
     var divStyle = {width: this.props.width};

     var thresholdRange = this.props.thresholdRange;
     var thresholdCurrent = this.props.thresholdCurrent;
     var thresholdStep = this.props.thresholdStep;

     var panelJSX =
     <div className="section">
        <h2> Threshold </h2>
     </div>;

     return <div> {panelJSX} </div>;
   }
});

module.exports = InsightThresholdSlider;
