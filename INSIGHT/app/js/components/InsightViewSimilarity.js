var React = require('react');

var InsightViewGraphs = require('./InsightViewGraphs');
var InsightViewTable = require('./InsightViewTable');
var InsightMenuBar = require('./InsightMenuBar');

var InsightConstants = require('./../flux/constants/InsightConstants');

var menuWidth = 25;
var tableHeight = 200;

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
          <InsightViewGraphs key={key}
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
                              dtwBiasValue={that.props.dtwBiasValue}/> //warpingPath={resultQueryPair.result.warpingPath}
        );
    });


  },
  render: function() {
    var similarityQueryInfo = this.props.similarityQueryInfo;
    var values = [], qStart = 0, qEnd = -1;
    
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
      <InsightViewGraphs viewingResults={false}
                        graphType={this.props.graphType}
                        width={this.props.width - menuWidth}
                        height={this.props.height - tableHeight}
                        qValues={values}
                        qStart={qStart}
                        qEnd={qEnd}
                        dtwBiasValue={this.props.dtwBiasValue}/>

    var InsightViewTableJSX =
    <div className="viewTable">
      <InsightViewTable width={this.props.width}
                        results={this.props.results.resultList}
                        height={tableHeight}/>
    </div>

    var InsightMenuBarJSX =
    <InsightMenuBar width={menuWidth}
                    height={this.props.height - tableHeight}
                    dtwBiasValue={this.props.dtwBiasValue}
                    results={this.props.results.viewLiveIndices.length > 0}/>;

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
              {InsightViewTableJSX}
            </div> );
   }
});

module.exports = InsightViewSimilarity;
