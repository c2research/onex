var React = require('react');

var InsightActions = require('./../../flux/actions/InsightActions');
var InsightConstants = require('./../../flux/constants/InsightConstants');

/**
 * This dropdown will have all the pre-existing queries
 */
var InsightSimilarityQuery = React.createClass({
   render: function() {
     var divStyle = {width: this.props.width};

     var distanceJSX = null;
     var uploadQueryJSX = (this.props.qTypeLocal == InsightConstants.QUERY_TYPE_UPLOAD) && <UploadQuery />;

     var panelJSX = this.props.dsCurrentLength > 0 &&
     <div className="section">
        <h5> Determine Query Location </h5>
        <QueryTypeRadio qTypeLocal={this.props.qTypeLocal}/>
        {uploadQueryJSX}
     </div>;
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

module.exports = InsightSimilarityQuery;
