var React = require('react');

var InsightSimilarityResultsView = require('./InsightSimilarityResultsView');
var InsightMenuBar = require('./InsightMenuBar');

var InsightConstants = require('./../../flux/constants/InsightConstants');

var menuWidth = 50;
var tableHeight = 0;//200

/**
 * This is a prototype for an initial view
 */
var InsightViewSimilarity = React.createClass({
  generateViews: function(results){
    var keepList = [];
    var val;
    for (val in results.viewLiveIndices) {
      keepList.push(results.resultList[val]);
    }
    var height = this.props.height - tableHeight / keepList.length;
    var that = this;

    var key = 0;
    return keepList.map(function(resultQueryPair, key){
        key += 1;
        return (
          <InsightSimilarityResultsView key={key}
                              viewingResults={true}
                              width={that.props.width - menuWidth}
                              height={height}
                              graphType={that.props.graphType}
                              qValues={resultQueryPair.qValues}
                              qStart={resultQueryPair.qStart}
                              qEnd={resultQueryPair.qEnd}
                              rValues={resultQueryPair.rValues}
                              warpingPath={resultQueryPair.warpingPath}
                              rStart={resultQueryPair.rStart}
                              rEnd={resultQueryPair.rEnd}
                              dtwBiasValue={that.props.dtwBiasValue}
                              viewRange={that.props.viewRange}/> //warpingPath={resultQueryPair.result.warpingPath}
        );
    });


  },
  render: function() {
    var similarityQueryInfo = this.props.similarityQueryInfo;
    var values = [], qStart = 0, qEnd = -1;

    //TODO(charlie): move this to the store, this 'logic' does not need to be so deep in
    if (similarityQueryInfo.qTypeLocal == InsightConstants.QUERY_TYPE_DATASET) {
      values = similarityQueryInfo.qDatasetValues;
      qStart = similarityQueryInfo.qDatasetStart;
      qEnd = similarityQueryInfo.qDatasetEnd;
    }
    else if (similarityQueryInfo.qTypeLocal == InsightConstants.QUERY_TYPE_UPLOAD) {
      values = similarityQueryInfo.qUploadValues;
      qStart = similarityQueryInfo.qUploadStart;
      qEnd = similarityQueryInfo.qUploadEnd;
    }

    var InsightViewGraphJSX = this.props.results.viewLiveIndices.length > 0 ?
      this.generateViews(this.props.results) :
      <InsightSimilarityResultsView viewingResults={false}
                        graphType={this.props.graphType}
                        width={this.props.width - menuWidth}
                        height={this.props.height - tableHeight}
                        qValues={values}
                        qStart={qStart}
                        qEnd={qEnd}
                        dtwBiasValue={this.props.dtwBiasValue}
                        viewRange={this.props.viewRange}/>

    var InsightMenuBarJSX = values.length > 0 ?
    <InsightMenuBar width={menuWidth}
                    height={this.props.height - tableHeight}
                    dtwBiasValue={this.props.dtwBiasValue}
                    results={this.props.results.viewLiveIndices.length > 0}
                    graphType={this.props.graphType}
                    /> : null;

    var divStyle = {
      width: this.props.width,
      height: this.props.height,
      marginLeft: this.props.marginLeft
    }
    var wrapperStyle = {
      overflow: 'hidden'
    }
    var floatStyle = {
      float: 'left'
    }

    return (<div className="insightView" style={divStyle}>
              <div style={wrapperStyle}>
                <div style={floatStyle}>
                  {InsightViewGraphJSX}
                </div>
                <div style={floatStyle}>
                  {InsightMenuBarJSX}
                </div>
              </div>
            </div> );
   }
});

module.exports = InsightViewSimilarity;
