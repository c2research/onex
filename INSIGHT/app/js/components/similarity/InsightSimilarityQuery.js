var React = require('react');

var InsightActions = require('./../../flux/actions/InsightActions');
var InsightConstants = require('./../../flux/constants/InsightConstants');

/**
 * This dropdown will have all the pre-existing queries
 */
var InsightSimilarityQuery = React.createClass({
   render: function() {
     var divStyle = {width: this.props.width};
     var uploadQueryJSX = <UploadQuery />;
     var wrapperStyle = { overflow: 'hidden' };
     var floatStyle = { float: 'left' };

     var style = {
       margin: 5
     }

     var panelJSX = <div className="panel" style={style}>
        <h4> Determine Query Location </h4>
        <div style={wrapperStyle}>
          <div style={floatStyle}>
            <QueryTypeRadio queryLocation={this.props.queryLocation}/>
          </div>
          <div style={floatStyle}>
            {uploadQueryJSX}
          </div>
        </div>
     </div>;
     return <div> {panelJSX} </div>;
   }
});

var QueryTypeRadio = React.createClass({
  render: function(){
    return (
      <div>
          <input type="radio" value={InsightConstants.QUERY_LOCATION_DATASET} checked={InsightConstants.QUERY_LOCATION_DATASET == this.props.queryLocation} onChange={this.setQueryType}/> Dataset
          <input type="radio" value={InsightConstants.QUERY_LOCATION_UPLOAD} checked={InsightConstants.QUERY_LOCATION_UPLOAD == this.props.queryLocation}  onChange={this.setQueryType}/> Upload
      </div>
    );
  },
  setQueryType: function(e){
    if (this.props.queryLocation != e.target.value) {
      InsightActions.selectQueryLocation(e.target.value);
    }
  }
});

var UploadQuery = React.createClass({
  render: function() {
    return (
    <div>
      <input type="file" id="files" name="query" onChange={this.uploadQueryFile}/>
      <output id="list"></output>
    </div>);
  },
  uploadQueryFile: function(e) {
    InsightActions.uploadQueryFile(e.target.files);
  }
});

module.exports = InsightSimilarityQuery;
