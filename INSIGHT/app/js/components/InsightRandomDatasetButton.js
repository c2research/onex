var React = require('react');

/**
 * This button calls for a query to be randomly generated
 */
var InsightRandomQueryButton = React.createClass({
   render: function() {
     var divStyle = {width: this.props.width};

     var panelJSX =
     <div>
        <h2> Random Query </h2>
     </div>;

     return <div> {panelJSX} </div>;
   }
});

module.exports = InsightRandomQueryButton;
