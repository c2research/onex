var React = require('react');
var InsightQuerySlider = require('./../InsightQuerySlider');
var InsightSimilarityQueryOptions = require('./InsightSimilarityQueryOptions');
var InsightActions = require('./../../flux/actions/InsightActions');
var InsightConstants = require('./../../flux/constants/InsightConstants');

/**
 * This dropdown will have all the pre-existing queries
 */
var InsightSimilarityQuery = React.createClass({
   render: function() {
     var divStyle = {width: this.props.width};

     var distanceJSX = null;

     var querySlider = this.props.qTypeLocal == InsightConstants.QUERY_TYPE_DATASET &&
                       <InsightQuerySlider
                          qSeq={this.props.qSeq}
                          dsCurrentLength={this.props.dsCurrentLength}
                          onChange={this._handleQueryChange} />


     var panelJSX = this.props.dsCurrentLength > 0 &&
     <div className="section">
        <h2> Query </h2>
        <QueryTypeRadio qTypeLocal={this.props.qTypeLocal}/>
        <UploadQuery />
        <div>
          {querySlider}
        </div>
     </div>;
     //<InsightSimilarityQueryOptions qValuesLength={this.props.qValues.length} qStart={this.props.qStart} qEnd={this.props.qEnd} />
     return <div> {panelJSX} </div>;
   },

   _handleQueryChange: function(e) {
    InsightActions.selectSimilarityQuery(parseInt(e.target.value, 10));
    clearTimeout(this._queryChangedId);
    this._queryChangedId = setTimeout(InsightActions.loadSimilarityQuery, 50);
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
