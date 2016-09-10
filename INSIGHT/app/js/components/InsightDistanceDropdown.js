var React = require('react');

/**
 * This dropdown will have all the distance functions (and will be hidden initially)
 */
var InsightDistanceDropdown = React.createClass({
   render: function() {
     var divStyle = {width: this.props.width};

     var distanceList = this.props.distanceList;
     var distanceCurrentIndex = this.props.distanceCurrentIndex;

     var panelJSX =
     <div className="section">
        <h2> Distance </h2>
     </div>;

     return <div> {panelJSX} </div>;
   }
});

module.exports = InsightDistanceDropdown;
