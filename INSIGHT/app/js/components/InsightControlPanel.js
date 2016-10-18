var React = require('react');

var InsightDatasetSection = require('./InsightDatasetSection');
var InsightQuery = require('./InsightQuery');
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

     var tabsJSX = this.props.visible &&
       <div className="controlPanelTabPane"
            style={style.divStyle} >
         {tabList}
       </div>;

    //show regardless
    var datasetJSX =
    <InsightDatasetSection  dsCollectionList={this.props.dsCollectionList}
                            dsCollectionIndex={this.props.dsCollectionIndex}
                            thresholdRange={this.props.thresholdRange}
                            thresholdCurrent={this.props.thresholdCurrent}
                            thresholdStep={this.props.thresholdStep}
                            datasetIconMode={this.props.datasetIconMode}/>;

    var values = this.props.qTypeLocal == InsightConstants.QUERY_TYPE_DATASET ? this.props.qDatasetValues:
                 this.props.qTypeLocal == InsightConstants.QUERY_TYPE_UPLOAD  ? this.props.qUploadValues : this.props.qBuildValues;

    var queryJSX = this.props.viewMode == InsightConstants.VIEW_MODE_SIMILARITY &&
    <InsightQuery viewMode={this.props.viewMode}
                  dsCurrentLength={this.props.dsCurrentLength}
                  qTypeLocal={this.props.qTypeLocal}
                  qValues={values}
                  qStart={this.props.qStart}
                  qEnd={this.props.qEnd}
                  qSeq={this.props.qSeq}/>;

    var findJSX = this.props.viewMode != InsightConstants.VIEW_MODE_CLUSTER &&
                  <InsightFind show={values.length > 0} />;

    var panelJSX = this.props.visible &&
    <div className="controlPanel" style={style.divStyle}>
      {tabsJSX}
      {datasetJSX}
      {queryJSX}
      {findJSX}
      <div style={style.cheatingStyle}> </div>
    </div>;

    return panelJSX;
   }
});

module.exports = InsightControlPanel;
