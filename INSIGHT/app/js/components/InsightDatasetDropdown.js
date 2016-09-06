var React = require('react');

/**
 * This dropdown will have all the datasets
 */
var InsightDatasetDropdown = React.createClass({
   render: function() {
     var divStyle = {width: this.props.width};

     var panelJSX =
     <div>
        <h2> Dataset Dropdown </h2>
     </div>;

     return <div> {panelJSX} </div>;
   }
});

module.exports = InsightDatasetDropdown;
