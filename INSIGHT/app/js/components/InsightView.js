var React = require('react');
var ReactDOM = require('react-dom');
var d3 = require('d3');

var InsightViewGraphs = require('./InsightViewGraphs');
var InsightViewTable = require('./InsightViewTable');
var InsightConstants = require('./../flux/constants/InsightConstants');


var LineChart = require('rd3').LineChart;
var AreaChart = require('rd3').AreaChart;

/**
 * This is a prototype for an initial view
 */
var InsightView = React.createClass({
  generateViews: function(results){
    var keepList = [];
    var val;
    for (val in results.viewLiveIndices) {
      keepList.push(results.resultList[val]);
    }
    var height = this.props.height - 200 / keepList.length;
    var that = this;

    var key = 0;
    return keepList.map(function(resultQueryPair, key){
        key += 1;
        return (
          <InsightViewGraphs key={key}
                              viewingResults={true}
                              width={that.props.width}
                              height={height}
                              graphType={that.props.graphType}
                              qValues={resultQueryPair.qValues}
                              qStart={resultQueryPair.qStart}
                              qEnd={resultQueryPair.qEnd}
                              rValues={resultQueryPair.rValues}
                              rStart={resultQueryPair.rStart}
                              rEnd={resultQueryPair.rEnd}/> //warpingPath={resultQueryPair.result.warpingPath}
        );
    });


  },
  render: function() {

    var values = this.props.qTypeLocal == InsightConstants.QUERY_TYPE_DATASET ? this.props.qDatasetValues:
                 this.props.qTypeLocal == InsightConstants.QUERY_TYPE_UPLOAD  ? this.props.qUploadValues : this.props.qBuildValues;

    var InsightViewGraphJSX = this.props.results.viewLiveIndices.length > 0 ?
      this.generateViews(this.props.results) :
      <InsightViewGraphs viewingResults={false}
                        graphType={this.props.graphType}
                        width={this.props.width}
                        height={this.props.height - 200}
                        qValues={values}
                        qStart={this.props.qStart}
                        qEnd={this.props.qEnd}/>

    var InsightViewTableJSX =
    <InsightViewTable width={this.props.width}
                      results={this.props.results.resultList}
                      height={200}/>

     return (<div className="containerD3">
               {InsightViewGraphJSX}
               {InsightViewTableJSX}
             </div> );
   }
});

module.exports = InsightView;
