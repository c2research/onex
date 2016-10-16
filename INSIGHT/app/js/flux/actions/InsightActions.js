var AppDispatcher = require('./../dispatcher/AppDispatcher');
var InsightConstants = require('./../constants/InsightConstants');

var InsightActions = {
  /**
   * @param {number} index
   * example function
   */
  displayTimeSeries: function(index) {
	  AppDispatcher.dispatch({
		  actionType: InsightConstants.DISPLAY_TS,
		  id: index
	  });
  },
  /**
   * calls to resize the app
   */
  resizeApp: function() {
	  AppDispatcher.dispatch({
		  actionType: InsightConstants.RESIZE_APP,
		  id: 1
	  });
  },
  /**
   * initiates function seq to get a new random query
   */
  requestRandomQuery: function() {
    AppDispatcher.dispatch({
      actionType: InsightConstants.REQUEST_RANDOM,
      id: 1
    });
  },
  /**
   * initiates function seq to get a new random query
   */
  selectDSIndex: function(index) {
    AppDispatcher.dispatch({
      actionType: InsightConstants.SELECT_DS_INDEX,
      id: index
    });
  },
  /**
   * initiates function seq to get a new random query
   */
  selectQueryType: function(value) {
    AppDispatcher.dispatch({
      actionType: value,
      id: 1
    });
  },
  /**
   * change the current selected query
   */
  selectQuery: function(index) {
    AppDispatcher.dispatch({
      actionType: InsightConstants.SELECT_QUERY,
      id: index
    });
  },
  /**
   * load the current selected query
   */
  loadQuery: function() {
    AppDispatcher.dispatch({
      actionType: InsightConstants.LOAD_QUERY
    })
  },
  /**
   * initiates function seq to get a new random query
   */
  selectDistance: function(index) {
    AppDispatcher.dispatch({
      actionType: InsightConstants.SELECT_DISTANCE,
      id: index
    });
  },
  /**
   * initiates function seq to select a threshold
   */
  selectThreshold: function(val) {
    AppDispatcher.dispatch({
      actionType: InsightConstants.SELECT_THRESHOLD,
      id: val
    });
  },
  /**
   * initiates function seq to set the start range of a query
   */
  selectStartQ: function(val) {
    AppDispatcher.dispatch({
      actionType: InsightConstants.SELECT_START_Q,
      id: val
    });
  },
  /**
   * initiates function seq to set the end range of a query
   */
  selectEndQ: function(val) {
    AppDispatcher.dispatch({
      actionType: InsightConstants.SELECT_END_Q,
      id: val
    });
  },
  /**
   * initiates function seq to process a data set
   */
  requestDatasetInit: function() {
    AppDispatcher.dispatch({
      actionType: InsightConstants.REQUEST_DATA_INIT,
      id: 1
    });
  },
  /**
   * initiates function seq to change view mode
   */
  switchViewMode: function(mode) {
    AppDispatcher.dispatch({
      actionType: mode,
      id: 0
    });
  },
 /*
  * initiates funciton seq to find similarity match
  */
  findMatch: function() {
    AppDispatcher.dispatch({
      actionType: InsightConstants.FIND_MATCH,
      id: 0
    });
  },
  /*
   * initiates funciton seq to find similarity match
   */
   uploadQueryFile: function(files) {
     AppDispatcher.dispatch({
       actionType: InsightConstants.UPLOAD_QUERY_FILE,
       id: files
     });
   },
   updateDTWBias: function(value) {
     AppDispatcher.dispatch({
       actionType: InsightConstants.SELECT_DTW_BIAS,
       id: value
     });
   }
};

module.exports = InsightActions;
