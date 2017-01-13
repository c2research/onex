var React = require('react');

//var InsightStore = require('./../flux/stores/InsightStore');
//var InsightStoreSimilarity = require('./../flux/stores/InsightStoreSimilarity');
var InsightStoreSeasonal = require('./../flux/stores/InsightStoreSeasonal');

var InsightStore = require('./../flux/stores/InsightStore');
var InsightStoreSimilarity = require('./../flux/stores/InsightStoreSimilarity');

var InsightConstants = require('./../flux/constants/InsightConstants');
var InsightActions = require('./../flux/actions/InsightActions');

var InsightBanner = require('./InsightBanner');
var InsightControlPanel = require('./InsightControlPanel');
var InsightSimilarityView = require('./similarity/InsightSimilarityView');
var InsightSeasonalView = require('./seasonal/InsightSeasonalView');
var InsightMessage = require('./InsightMessage');

var resizeId;

/**
 * Retrieve the current data from the store
 * @return {object}
 */
function getState() {
  return {

    /* ### general state ### */
    // dataset information
    // dsCollectionList: InsightStore.getDSCollectionList(),
    // dsCollectionIndex: InsightStore.getDSCollectionIndex(),
    // dsCurrentLength: InsightStore.getDSCurrentLength(),

    datasetData: InsightStore.getDatasetData(),

    //threshold
    // thresholdRange: InsightStore.getThresholdRange(),
    // thresholdCurrent: InsightStore.getThresholdCurrent(),
    // thresholdStep: InsightStore.getThresholdStep(),

    thresholdData: InsightStore.getThresholdData(),

    // meta
    // viewMode: InsightStore.getViewMode(),
    // sizing: InsightStore.getSizing(),
    // message: InsightStore.getMessage(),
    // datasetIconMode: InsightStore.getDatasetIconMode(),

    metadata: InsightStore.getData(),

    /* ### similarity state ### */
    // graphType: InsightStoreSimilarity.getGraphType(),
    // similarityQueryInfo: InsightStoreSimilarity.getSimilarityQueryInfo(),
    // similarityResults: InsightStoreSimilarity.getResults(),
    // viewRange: InsightStoreSimilarity.getViewRange(),
    //
    // //dtw bias & menu options
    // dtwBiasValue: InsightStoreSimilarity.getDTWBias(),

    previewData: InsightStoreSimilarity.getPreviewData(),
    resultViewData: InsightStoreSimilarity.getResultViewData(),
    queryListViewData: InsightStoreSimilarity.getQueryListViewData(),
    groupViewData: InsightStoreSimilarity.getGroupViewData(),


    /* ### seasonal state ### */
    seasonalQueryInfo: InsightStoreSeasonal.getSeasonalQueryInfo(),
    seasonalResults: InsightStoreSeasonal.getResults(),

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
    var insightViewJSX;

    switch (this.state.metadata.viewMode) {
      case InsightConstants.VIEW_MODE_SIMILARITY:
        insightViewJSX =  <InsightSimilarityView marginLeft={this.state.metadata.sizing.controlPanelWidth}
                                                 width={this.state.metadata.sizing.displayWidth}
                                                 height={this.state.metadata.sizing.displayHeight}
                                                 previewData={this.state.previewData}
                                                 resultViewData={this.state.resultViewData}
                                                 groupViewData={this.state.groupViewData}
                                                 queryListViewData={this.state.queryListViewData}
                                                 metadata={this.state.datasetData.metadata}
                                                 />
        break;
      case InsightConstants.VIEW_MODE_SEASONAL:
        insightViewJSX = <InsightSeasonalView marginLeft={this.state.metadata.sizing.controlPanelWidth}
                                              width={this.state.metadata.sizing.displayWidth}
                                              height={this.state.metadata.sizing.displayHeight}
                                              seasonalQueryInfo={this.state.seasonalQueryInfo}
                                              results={this.state.seasonalResults}
                                              metadata={this.state.datasetData.metadata}
                                              />
        break;
      case InsightConstants.VIEW_MODE_CLUSTER:
        insightViewJSX = null;
        break;
      default:
        //no op
    }

    return (
      <div className="insightPlatform">
        <InsightBanner baseTitle="INSIGHT" />
        <InsightMessage {...this.state.metadata.message}/>
        <InsightControlPanel width={this.state.metadata.sizing.controlPanelWidth}
                             viewMode={this.state.metadata.viewMode}
                             datasetIconMode={this.state.metadata.datasetIconMode}
                             {...this.state.datasetData}
                             {...this.state.thresholdData}
                             seasonal={this.state.seasonalQueryInfo}/>
        {insightViewJSX}
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
