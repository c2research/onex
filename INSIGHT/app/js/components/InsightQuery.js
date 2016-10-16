var React = require('react');
var InsightQuerySlider = require('./InsightQuerySlider');
var InsightQueryOptions = require('./InsightQueryOptions');
var InsightActions = require('./../flux/actions/InsightActions');
var InsightConstants = require('./../flux/constants/InsightConstants');

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

     var panelJSX = this.props.dsCurrentLength > 0 ?
     <div className="section">
        <h2> Query </h2>
        <QueryTypeRadio qTypeLocal={this.props.qTypeLocal}/>
        <UploadQuery />
        <div>
          <div>
            <InsightQuerySlider qSeq={this.props.qSeq} dsCurrentLength={this.props.dsCurrentLength} />
            <InsightQueryOptions qValues={this.props.qValues} qStart={this.props.qStart} qEnd={this.props.qEnd} />
          </div>
        </div>
     </div> : null;

     return <div> {panelJSX} </div>;
   }
});

var QueryTypeRadio = React.createClass({
  render: function(){
    return (
      <div className="panel" >
        <h4> Choose which Query Type to Use </h4>
          <input type="radio" value={InsightConstants.QUERY_TYPE_DATASET} checked={InsightConstants.QUERY_TYPE_DATASET == this.props.qTypeLocal} onChange={this.setQueryType}/> Dataset
          <input type="radio" value={InsightConstants.QUERY_TYPE_UPLOAD} checked={InsightConstants.QUERY_TYPE_UPLOAD == this.props.qTypeLocal}  onChange={this.setQueryType}/> Upload
      </div>
    );
  },
  setQueryType: function(e){
    if (this.props.qTypeLocal != e.target.value) {
      InsightActions.selectQueryType(e.target.value);
    }
  }
});

var UploadQuery = React.createClass({
  render: function() {
    return (
    <div className="panel" >
      <h4> Upload a Query from File </h4>
      <input type="file" id="files" name="query" onChange={this.uploadQueryFile}/>
      <output id="list"></output>
    </div>);
  },
  uploadQueryFile: function(e) {
    InsightActions.uploadQueryFile(e.target.files);
  }
});

module.exports = InsightQuery;
