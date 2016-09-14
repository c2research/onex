var React = require('react');

var InsightDatasetDropdown = require('./InsightDatasetDropdown');
var InsightQuery = require('./InsightQuery');
var InsightRandomQueryButton = require('./InsightRandomDatasetButton');
var InsightTab = require('./InsightTab');
var InsightFind = require('./InsightFind');

var InsightConstants = require('./../flux/constants/InsightConstants');


/**
 * The control panel containing all the options and queries etc
 */
var InsightControlPanel = React.createClass({

   render: function() {
     var divStyle = {width: this.props.width};

     //TODO: generalize this (probably)
     var modeList = [InsightConstants.VIEW_MODE_SIMILARITY,
                     InsightConstants.VIEW_MODE_SEASONAL,
                     InsightConstants.VIEW_MODE_CLUSTER];

     var that = this;
     var tabList = modeList.map(function(mode) {
       return <InsightTab type={mode} current={that.props.viewMode} width={that.props.width / 3 - 10} key={mode} />;
     })

     var tabsJSX = this.props.visible ?
       <div className="controlPanelTabPane"
            style={divStyle} >
         {tabList}
       </div> : null;

    //show regardless
    var datasetJSX =
    <InsightDatasetDropdown dsCollectionList={this.props.dsCollectionList}
                            dsCollectionIndex={this.props.dsCollectionIndex}
                            thresholdRange={this.props.thresholdRange}
                            thresholdCurrent={this.props.thresholdCurrent}
                            thresholdStep={this.props.thresholdStep}/>;


    var queryJSX = this.props.viewMode == InsightConstants.VIEW_MODE_SIMILARITY ?
    <InsightQuery viewMode={this.props.viewMode}
                  dsCurrentLength={this.props.dsCurrentLength}
                  qValues={this.props.qValues}
                  qSeq={this.props.qSeq}/> : null;

    var findJSX = this.props.viewMode != InsightConstants.VIEW_MODE_CLUSTER ?
                  <InsightFind /> : null;


    var panelJSX = this.props.visible ?
    <div className="controlPanel"
         style={divStyle} >
      {tabsJSX}
      {datasetJSX}
      {queryJSX}

      {findJSX}
    </div> : null;

    return panelJSX;
   }
});

module.exports = InsightControlPanel;
