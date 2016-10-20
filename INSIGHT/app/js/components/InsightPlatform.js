var React = require('react');

var InsightStore = require('./../flux/stores/InsightStore');
var InsightStoreSimilarity = require('./../flux/stores/InsightStoreSimilarity');
var InsightStoreSeasonal = require('./../flux/stores/InsightStoreSeasonal');

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

    /* ### general state ### */
    // dataset information
    dsCollectionList: InsightStore.getDSCollectionList(),
    dsCollectionIndex: InsightStore.getDSCollectionIndex(),
    dsCurrentLength: InsightStore.getDSCurrentLength(),

    //threshold
    thresholdRange: InsightStore.getThresholdRange(),
    thresholdCurrent: InsightStore.getThresholdCurrent(),
    thresholdStep: InsightStore.getThresholdStep(),

    // meta
    viewMode: InsightStore.getViewMode(),
    sizing: InsightStore.getSizing(),

    //icon modes
    datasetIconMode: InsightStore.getDatasetIconMode(),

    /* ### similarity state ### */

    similarityQueryInfo: InsightStoreSimilarity.getSimilarityQueryInfo(),
    results: InsightStoreSimilarity.getResults(),

    //dtw bias & menu options
    dtwBiasValue: InsightStoreSimilarity.getDTWBias()

    /* ### seasonal state ### */



    // //future
    // distanceList: InsightStore.getDistanceList(),
    // distanceCurrentIndex: InsightStore.getDistanceCurrentIndex(),
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
    console.log(InsightStore.getDSCollectionIndex(), InsightStoreSimilarity.getSimilarityQueryInfo());


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
        <InsightControlPanel width={this.state.sizing.controlPanelWidth}
                             viewMode={this.state.viewMode}
                             dsCollectionList={this.state.dsCollectionList}
                             dsCollectionIndex={this.state.dsCollectionIndex}
                             dsCurrentLength={this.state.dsCurrentLength}
                             datasetIconMode={this.state.datasetIconMode}
                             thresholdRange={this.state.thresholdRange}
                             thresholdCurrent={this.state.thresholdCurrent}
                             thresholdStep={this.state.thresholdStep}
                             similarityQueryInfo={this.state.similarityQueryInfo}
                             distanceList={this.state.distanceList}
                             distanceCurrentIndex={this.state.distanceCurrentIndex}
        />
        <InsightView marginLeft={this.state.sizing.controlPanelWidth}
                     width={this.state.sizing.displayWidth}
                     height={this.state.sizing.displayHeight}
                     similarityQueryInfo={this.state.similarityQueryInfo}
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
