var React = require('react');

var InsightActions = require('./../../flux/actions/InsightActions');
var InsightConstants = require('./../../flux/constants/InsightConstants');

var noSpaceStyle = {
  padding: 0,
  margin: 0,
  padding: 0
}

var InsightSimilarityQuery = React.createClass({
   render: function() {
     var divStyle = {width: this.props.width};
     var uploadQueryJSX = <UploadQuery />;
     var wrapperStyle = {
       overflow: 'hidden',
       padding: 0,
       margin: 0
     };
     var floatStyle = {
       float: 'left',
       padding: 0,
       margin: 0,
       marginLeft: 5
     };

     var panelJSX =
       <div style={noSpaceStyle}>
         <h4 style={noSpaceStyle} className={'query'}> Queries </h4>
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
    var inputStyle = {
      padding: 0,
      margin: 0,
      marginLeft: 5,
      paddingLeft: 5,
      paddingRight: 5
    }
    return (
      <div style={noSpaceStyle}>
          <input style={inputStyle} type="radio" value={InsightConstants.QUERY_LOCATION_DATASET} checked={InsightConstants.QUERY_LOCATION_DATASET == this.props.queryLocation} onChange={this.setQueryType}/> Dataset
          <input style={inputStyle} type="radio" value={InsightConstants.QUERY_LOCATION_UPLOAD} checked={InsightConstants.QUERY_LOCATION_UPLOAD == this.props.queryLocation}  onChange={this.setQueryType}/> Upload
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
    var inputStyle = {
      padding: 0,
      margin: 0,
      paddingLeft: 15,
      width: 175
    }
    return (
    <div style={noSpaceStyle}>
      <input style={inputStyle} type="file" id="files" name="query" onChange={this.uploadQueryFile}/>
    </div>);
  },
  uploadQueryFile: function(e) {
    InsightActions.uploadQueryFile(e.target.files);
  }
});

module.exports = InsightSimilarityQuery;
