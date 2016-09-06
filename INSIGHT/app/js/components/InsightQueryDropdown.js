var React = require('react');

/**
 * This dropdown will have all the pre-existing queries
 */
var InsightQueryDropdown = React.createClass({
   render: function() {
     var divStyle = {width: this.props.width};

     var panelJSX =
     <div>
        <h2> Query Dropdown </h2>
     </div>;

     return <div> {panelJSX} </div>;
   }
});

module.exports = InsightQueryDropdown;
