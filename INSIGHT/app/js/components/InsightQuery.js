var React = require('react');
var InsightQuerySlider = require('./InsightQuerySlider');
var InsightQueryOptions = require('./InsightQueryOptions');

/**
 * This dropdown will have all the pre-existing queries
 */
var InsightQuery = React.createClass({
   render: function() {
     var divStyle = {width: this.props.width};

     var queryList=this.props.queryList;
     var queryCurrentIndex=this.props.queryCurrentIndex;

     var distanceJSX = null; /*this.props.viewMode == InsightConstants.VIEW_MODE_SIMILARITY || this.props.viewMode == InsightConstants.VIEW_MODE_SEASONAL ?
     <InsightDistanceDropdown distanceList={this.props.distanceList}
                              distanceCurrentIndex={this.props.distanceCurrentIndex}/> : null;
     */

     /*
     <div className="options">
       <div className="iconWrapper"> <i className="fa fa-upload" aria-hidden="false"></i></div>
       <h3 className="options"> Load query from File  </h3>
     </div>
     <div  className="options">
     <div className="iconWrapper"> <i className="fa fa-gears" aria-hidden="false"></i></div>
       <h3 className="options"> Interative Query Building </h3>
     </div>
     */

     var panelJSX =
     <div className="section">
        <h2> Query </h2>
        <div className="options">
          <div className="iconWrapper"> <i className="fa fa-database" aria-hidden="false"></i></div>
          <h3 className="options"> From current Dataset  </h3>
          <div className="options">
            <InsightQuerySlider qSeq={this.props.qSeq} dsCurrentLength={this.props.dsCurrentLength} />
            <InsightQueryOptions qSeq={this.props.qSeq} qValues={this.props.qValues} />
          </div>
        </div>
     </div>;

     return <div> {panelJSX} </div>;
   }
});

module.exports = InsightQuery;
