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
  selectDataset: function(index) {
    AppDispatcher.dispatch({
      actionType: InsightConstants.SELECT_DATASET_INDEX,
      id: index
    });
  },
  /**
   * initiates function seq to get a new random query
   */
  selectQuery: function(indexPair) {
    AppDispatcher.dispatch({
      actionType: InsightConstants.SELECT_DATASET_INDEX,
      id: indexPair
    });
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
   * initiates function seq to get a new random query
   */
  selectThreshold: function(val) {
    AppDispatcher.dispatch({
      actionType: InsightConstants.SELECT_THRESHOLD,
      id: val
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
  }
};

module.exports = InsightActions;
