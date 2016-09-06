var React = require('react');

/**
 * This dropdown will have all the datasets
 */
var InsightThresholdSlider = React.createClass({
   render: function() {
     var divStyle = {width: this.props.width};

     var panelJSX =
     <div>
        <h2> Threshold Slider </h2>
     </div>;

     return <div> {panelJSX} </div>;
   }
});

module.exports = InsightThresholdSlider;
