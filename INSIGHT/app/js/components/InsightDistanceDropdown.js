var React = require('react');

/**
 * This dropdown will have all the distance functions (and will be hidden initially)
 */
var InsightDistanceDropdown = React.createClass({
   render: function() {
     var divStyle = {width: this.props.width};

     var panelJSX =
     <div>
        <h2> Distance Dropdown </h2>
     </div>;

     return <div> {panelJSX} </div>;
   }
});

module.exports = InsightDistanceDropdown;
