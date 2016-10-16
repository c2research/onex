var React = require('react');

var InsightStore = require('./../flux/stores/InsightStore');
var InsightConstants = require('./../flux/constants/InsightConstants');
var InsightActions = require('./../flux/actions/InsightActions');

var InsightBanner = require('./InsightBanner');
var InsightControlPanel = require('./InsightControlPanel');
var InsightView = require('./InsightView');

var resizeId;

/**
 * Retrieve the current data from the store
 * @return {object}
 */
function getState() {
  return {
    dsCollectionList: InsightStore.getDSCollectionList(),
    dsCollectionIndex: InsightStore.getDSCollectionIndex(),
    dsCurrentLength: InsightStore.getDSCurrentLength(),

    //query
    qTypeLocal: InsightStore.getQTypeLocal(),
    qUploadValues: InsightStore.getQUploadValues(),
    qDatasetValues: InsightStore.getQDatasetValues(),
    qSeq: InsightStore.getQSeq(),
    qStart: InsightStore.getQStart(),
    qEnd: InsightStore.getQEnd(),
    results: InsightStore.getResults(),

    //meta (will add sizing stuff)
    controlPanelVisible: InsightStore.getControlPanelVisible(),
    viewMode: InsightStore.getViewMode(),
    sizing: InsightStore.getSizing(),

    //threshold
    thresholdRange: InsightStore.getThresholdRange(),
    thresholdCurrent: InsightStore.getThresholdCurrent(),
    thresholdStep: InsightStore.getThresholdStep(),

    //future
    distanceList: InsightStore.getDistanceList(),
    distanceCurrentIndex: InsightStore.getDistanceCurrentIndex(),

    //icon modes
    datasetIconMode: InsightStore.getDatasetIconMode(),

    //dtw bias & menu options
    dtwBiasValue: InsightStore.getDTWBias()
  };
}

/**
 * The InsightPlatform will layout the framework of the app, and action
 * as the view controller. All changes will cascade down from here through
 * props to children nodes.
 */
var InsightPlatform = React.createClass({
  /**
   * Gets the initial data for the state of the app
   */
  getInitialState: function() {
    return getState();
  },
  /**
   * Event handler for 'change' events coming from the InsightStore
   * This will refresh the appropriate state values from the store
   */
   _onChange: function() {
     this.setState(getState());
   },
   componentWillMount: function() {
     //set initial state values
     InsightStore.init();
     this.setState(getState());
   },
   componentDidMount: function() {
     //add event for resizing
     window.addEventListener('resize', this._eventListenerResize);

     //listen for changes from store (flux)
     InsightStore.addChangeListener(this._onChange);
   },
   componentWillUnmount: function() {
     //remove change listener
     window.removeEventListener('resize');

     //stop listening for changes from store (flux)
     InsightStore.removeChangeListener(this._onChange);
   },
   render: function() {
     return (
       <div className="insightPlatform">
         <InsightBanner baseTitle="insight" />
         <InsightControlPanel visible={this.state.controlPanelVisible}
                              width={this.state.sizing.controlPanelWidth}
                              dsCollectionList={this.state.dsCollectionList}
                              dsCollectionIndex={this.state.dsCollectionIndex}
                              dsCurrentLength={this.state.dsCurrentLength}
                              qTypeLocal={this.state.qTypeLocal}
                              qSeq={this.state.qSeq}
                              qDatasetValues={this.state.qDatasetValues}
                              qUploadValues={this.state.qUploadValues}
                              thresholdRange={this.state.thresholdRange}
                              thresholdCurrent={this.state.thresholdCurrent}
                              thresholdStep={this.state.thresholdStep}
                              viewMode={this.state.viewMode}
                              qStart={this.state.qStart}
                              qEnd={this.state.qEnd}
                              distanceList={this.state.distanceList}
                              distanceCurrentIndex={this.state.distanceCurrentIndex}
                              datasetIconMode={this.state.datasetIconMode}
                            />
          <InsightView marginLeft={this.state.sizing.controlPanelWidth}
                       width={this.state.sizing.displayWidth}
                       height={this.state.sizing.displayHeight}
                       qTypeLocal={this.state.qTypeLocal}
                       qUploadValues={this.state.qUploadValues}
                       qDatasetValues={this.state.qDatasetValues}
                       qSeq={this.state.qSeq}
                       qStart={this.state.qStart}
                       qEnd={this.state.qEnd}
                       results={this.state.results}
                       dtwBiasValue={this.state.dtwBiasValue}
                      />
       </div>
     );
   },

   /** private functions **/
   /**
    * Called when the window is resized
    */
   _eventListenerResize: function(){
    clearTimeout(resizeId);
    resizeId = setTimeout(this._onResizeAction, 100);
   },
   /**
    * user stopped resizing, go!
    */
   _onResizeAction: function(){
     InsightActions.resizeApp();
   }
});

module.exports = InsightPlatform;
