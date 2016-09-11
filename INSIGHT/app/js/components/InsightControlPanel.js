var React = require('react');

var InsightDatasetDropdown = require('./InsightDatasetDropdown');
var InsightQueryDropdown   = require('./InsightQuery');
var InsightDistanceDropdown = require('./InsightDistanceDropdown');
var InsightThresholdSlider = require('./InsightThresholdSlider');
var InsightRandomQueryButton = require('./InsightRandomDatasetButton');
var InsightTab = require('./InsightTab');

var InsightConstants = require('./../flux/constants/InsightConstants');


/**
 * The control panel containing all the options and queries etc
 */
var InsightControlPanel = React.createClass({

   render: function() {
     var divStyle = {width: this.props.width};

     var modeList = [InsightConstants.VIEW_MODE_SIMILARITY, InsightConstants.VIEW_MODE_SEASONAL, InsightConstants.VIEW_MODE_CLUSTER];

     var that = this;
     var tabList = modeList.map(function(mode) {
       return <InsightTab type={mode} current={that.props.viewMode} width={that.props.width / 3 - 10} key={mode} />;
     })

     var tabsJSX = this.props.visible ?
       <div className="controlPanelTabPane"
            style={divStyle} >
         {tabList}
       </div> : null;

    //view modes


    //show regardless
    var datasetJSX =
    <InsightDatasetDropdown datasetList={this.props.datasetList}
                            datasetCurrentSet={this.props.datasetCurrentSet}
                            datasetCurrentIndex={this.props.datasetCurrentIndex}/>;
    var distanceJSX = this.props.viewMode == InsightConstants.VIEW_MODE_SIMILARITY || this.props.viewMode == InsightConstants.VIEW_MODE_SEASONAL ?
    <InsightDistanceDropdown distanceList={this.props.distanceList}
                             distanceCurrentIndex={this.props.distanceCurrentIndex}/> : null;

    var optionsJSX = this.props.viewMode == InsightConstants.VIEW_MODE_SIMILARITY ?
    <InsightQueryDropdown viewMode={this.props.viewMode}/> : null;

    var panelJSX = this.props.visible ?
       <div className="controlPanel"
            style={divStyle} >
         {tabsJSX}
         {datasetJSX}
         {optionsJSX}
         {distanceJSX}
         <InsightThresholdSlider  thresholdRange={this.props.thresholdRange}
                                  thresholdCurrent={this.props.thresholdCurrent}
                                  thresholdStep={this.props.thresholdStep}/>
       </div>
       : null;




     return <div> {panelJSX} </div>;
   }
});

module.exports = InsightControlPanel;
