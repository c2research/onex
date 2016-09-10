var React = require('react');

var InsightDatasetDropdown = require('./InsightDatasetDropdown');
var InsightQueryDropdown   = require('./InsightQueryDropdown');
var InsightDistanceDropdown = require('./InsightDistanceDropdown');
var InsightThresholdSlider = require('./InsightThresholdSlider');
var InsightRandomQueryButton = require('./InsightRandomDatasetButton');

/**
 * The control panel containing all the options and queries etc
 */
var InsightControlPanel = React.createClass({
   render: function() {
     var divStyle = {width: this.props.width};

     var panelJSX = this.props.visible ?
       <div className="controlPanel"
            style={divStyle} >
         <InsightDatasetDropdown datasetList={this.props.datasetList}
                                 datasetCurrentSet={this.props.datasetCurrentSet}
                                 datasetCurrentIndex={this.props.datasetCurrentIndex}/>
         <InsightQueryDropdown queryList={this.props.queryList}
                               queryCurrentIndex={this.props.queryCurrentIndex}/>
         <InsightDistanceDropdown distanceList={this.props.distanceList}
                                  distanceCurrentIndex={this.props.distanceCurrentIndex}/>
         <InsightThresholdSlider  thresholdRange={this.props.thresholdRange}
                                  thresholdCurrent={this.props.thresholdCurrent}
                                  thresholdStep={this.props.thresholdStep}/>
         <InsightRandomQueryButton />
       </div>
       : null;


     return <div> {panelJSX} </div>;
   }
});

module.exports = InsightControlPanel;
