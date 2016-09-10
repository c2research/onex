var React = require('react');

/**
 * This dropdown will have all the pre-existing queries
 */
var InsightQueryDropdown = React.createClass({
   render: function() {
     var divStyle = {width: this.props.width};

     var queryList=this.props.queryList;
     var queryCurrentIndex=this.props.queryCurrentIndex;

     var panelJSX =
     <div className="section">
        <h2> Query </h2>
     </div>;

     return <div> {panelJSX} </div>;
   }
});

module.exports = InsightQueryDropdown;
