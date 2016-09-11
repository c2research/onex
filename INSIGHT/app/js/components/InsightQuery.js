var React = require('react');

/**
 * This dropdown will have all the pre-existing queries
 */
var InsightQuery = React.createClass({
   render: function() {
     var divStyle = {width: this.props.width};

     var queryList=this.props.queryList;
     var queryCurrentIndex=this.props.queryCurrentIndex;

     var panelJSX =
     <div className="section">
        <h2> Query </h2>

        <div>
          <h3 className="options"> Load A File </h3>
        </div>
        <div>
          <h3 className="options"> Choose from the dataset </h3>
        </div>
        <div>
          <h3 className="options"> Interative Query Building </h3>
        </div>

     </div>;

     return <div> {panelJSX} </div>;
   }
});

module.exports = InsightQuery;
