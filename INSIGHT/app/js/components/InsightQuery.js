var React = require('react');
var InsightQueryDropdown = require('./InsightQueryDropdown');

/**
 * This dropdown will have all the pre-existing queries
 */
var InsightQuery = React.createClass({
   render: function() {
     var divStyle = {width: this.props.width};

     var queryList=this.props.queryList;
     var queryCurrentIndex=this.props.queryCurrentIndex;

     //fix this whenever possible:
     var magicNumber = 275 - 10 - 20 - 30 + "px";

     var panelJSX =
     <div className="section">
        <h2> Query </h2>
        <div className="options">
          <div className="iconWrapper"> <i className="fa fa-database" aria-hidden="false"></i></div>
          <h3 className="options"> From current Dataset  </h3>
          <div className="options">
            <InsightQueryDropdown />
          </div>
        </div>
        <div className="options">
          <div className="iconWrapper"> <i className="fa fa-upload" aria-hidden="false"></i></div>
          <h3 className="options"> Load query from File  </h3>
        </div>
        <div  className="options">
        <div className="iconWrapper"> <i className="fa fa-gears" aria-hidden="false"></i></div>
          <h3 className="options"> Interative Query Building </h3>
        </div>
     </div>;

     return <div> {panelJSX} </div>;
   }
});

module.exports = InsightQuery;
