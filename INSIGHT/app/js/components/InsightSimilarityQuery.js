var React = require('react');
var InsightQuerySlider = require('./InsightQuerySlider');
var InsightQueryOptions = require('./InsightQueryOptions');
var InsightActions = require('./../flux/actions/InsightActions');
var InsightConstants = require('./../flux/constants/InsightConstants');

/**
 * This dropdown will have all the pre-existing queries
 */
var InsightSimilarityQuery = React.createClass({
   render: function() {
     var divStyle = {width: this.props.width};

     var queryList=this.props.queryList;
     var queryCurrentIndex=this.props.queryCurrentIndex;

     var distanceJSX = null; 

     var querySlider = this.props.qTypeLocal == InsightConstants.QUERY_TYPE_DATASET && 
                       <InsightQuerySlider qSeq={this.props.qSeq} dsCurrentLength={this.props.dsCurrentLength} />


     var panelJSX = this.props.dsCurrentLength > 0 &&
     <div className="section">
        <h2> Query </h2>
        <QueryTypeRadio qTypeLocal={this.props.qTypeLocal}/>
        <UploadQuery />
        <div>
          {querySlider}
          <InsightQueryOptions qValues={this.props.qValues} qStart={this.props.qStart} qEnd={this.props.qEnd} />
        </div>
     </div>;

     return <div> {panelJSX} </div>;
   }
});

module.exports = InsightSimilarityQuery;
