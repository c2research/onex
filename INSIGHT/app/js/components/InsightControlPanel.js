var React = require('react');

var InsightDatasetSection = require('./InsightDatasetSection');
var InsightSimilarityQuery = require('./InsightSimilarityQuery');
var InsightTab = require('./InsightTab');
var InsightFind = require('./InsightFind');

var InsightConstants = require('./../flux/constants/InsightConstants');


/**
 * The control panel containing all the options and queries etc
 */
var InsightControlPanel = React.createClass({

  render: function() {
    var style = {
      divStyle : {width: this.props.width},
      cheatingStyle : {
       height: 100
      }
    }

    //TODO: generalize this (probably)
    var modeList = [InsightConstants.VIEW_MODE_SIMILARITY,
                   InsightConstants.VIEW_MODE_SEASONAL,
                   InsightConstants.VIEW_MODE_CLUSTER];

    var that = this;
    var tabList = modeList.map(function(mode) {
      return <InsightTab type={mode} current={that.props.viewMode} width={that.props.width / 3 - 10} key={mode} />;
    });

    var tabsJSX =
    <div className="controlPanelTabPane"
         style={style.divStyle} >
      {tabList}
    </div>;

    //show regardless
    var datasetJSX =
    <InsightDatasetSection dsCollectionList={this.props.dsCollectionList}
                           dsCollectionIndex={this.props.dsCollectionIndex}
                           thresholdRange={this.props.thresholdRange}
                           thresholdCurrent={this.props.thresholdCurrent}
                           thresholdStep={this.props.thresholdStep}
                           datasetIconMode={this.props.datasetIconMode}/>;

    var queryControlJSX = null;
    switch (this.props.viewMode) {
      case InsightConstants.VIEW_MODE_SIMILARITY:
        queryControlJSX = this._getSimilarityQueryControls();
        break;
      case InsightConstants.VIEW_MODE_SEASONAL:
        queryControlJSX = this._getSeasonalQueryControls();
        break;
      case InsightConstants.VIEW_MODE_CLUSTER:
        queryControlJSX = this._getClusterQueryControls();
        break;
    }

    var panelJSX = 
    <div className="controlPanel" style={style.divStyle}>
      {tabsJSX}
      {datasetJSX}
      {queryControlJSX}
      <div style={style.cheatingStyle}> </div>
    </div>;
    return panelJSX;
  },

  _getSimilarityQueryControls: function() {
    var similarityQueryInfo = this.props.similarityQueryInfo;
    var qTypeLocal = similarityQueryInfo.qTypeLocal;
    var values, qStart, qEnd, qSeq;

    if (qTypeLocal == InsightConstants.QUERY_TYPE_DATASET) {
      values = similarityQueryInfo.qDatasetValues;
      qStart = similarityQueryInfo.qDatasetStart;
      qEnd = similarityQueryInfo.qDatasetEnd;
      qSeq = similarityQueryInfo.qDatasetSeq;
    } else if (qTypeLocal == InsightConstants.QUERY_TYPE_UPLOAD) {
      values = similarityQueryInfo.qUploadValues;
      qStart = similarityQueryInfo.qUploadStart;
      qEnd = similarityQueryInfo.qUploadEnd;
      qSeq = similarityQueryInfo.qUploadSeq;
    } else {
      values = similarityQueryInfo.qBuildValues;
    }

    var queryJSX = <InsightSimilarityQuery viewMode={this.props.viewMode}
                                           dsCurrentLength={this.props.dsCurrentLength}
                                           qTypeLocal={qTypeLocal}
                                           qValues={values}
                                           qStart={qStart}
                                           qEnd={qEnd}
                                           qSeq={qSeq}/>;

    var findButtonJSX = <InsightFind show={values.length > 0}
                                     viewMode={this.props.viewMode}/>;

    return <div>
      {queryJSX}
      {findButtonJSX}
    </div>;
  },

  _getSeasonalQueryControls: function() {
    //var findButtonJSX = <InsightFind show={values.length > 0}
    //                                 viewMode={this.props.viewMode}/>;

    return null;
  },

  _getClusterQueryControls: function() {
    return null;
  }
});

module.exports = InsightControlPanel;
