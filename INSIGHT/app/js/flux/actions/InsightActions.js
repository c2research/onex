var AppDispatcher = require('./../dispatcher/AppDispatcher');
var InsightConstants = require('./../constants/InsightConstants');

var InsightActions = {
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
  selectSimilarityQuery: function(index) {
    AppDispatcher.dispatch({
      actionType: InsightConstants.SIMILARITY_SELECT_QUERY,
      id: index
    });
  },
  /**
   * load the current selected query
   */
  loadSimilarityQuery: function() {
    AppDispatcher.dispatch({
      actionType: InsightConstants.SIMILARITY_LOAD_QUERY
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
  selectSimilarityStartQ: function(val) {
    AppDispatcher.dispatch({
      actionType: InsightConstants.SIMILARITY_SELECT_START_Q,
      id: val
    });
  },
  /**
   * initiates function seq to set the end range of a query
   */
  selectSimilarityEndQ: function(val) {
    AppDispatcher.dispatch({
      actionType: InsightConstants.SIMILARITY_SELECT_END_Q,
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
  selectViewMode: function(mode) {
    AppDispatcher.dispatch({
      actionType: mode,
      id: 0
    });
  },
  /**
   * initiates function seq to change graphTypeList
   */
  selectGraphType: function(mode) {
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
  },
  selectSeasonalQuery: function(index) {
    AppDispatcher.dispatch({
      actionType: InsightConstants.SEASONAL_SELECT_QUERY,
      id: index
    });
  },
  loadSeasonalQuery: function() {
    AppDispatcher.dispatch({
      actionType: InsightConstants.SEASONAL_LOAD_QUERY
    });
  },
  selectSeasonalLength: function(value) {
    AppDispatcher.dispatch({
      actionType: InsightConstants.SEASONAL_SELECT_LENGTH,
      id: value
    });
  },
  selectSeasonalPatternIndex: function(index) {
    AppDispatcher.dispatch({
      actionType: InsightConstants.SEASONAL_SELECT_PATTERN_INDEX,
      id: index
    });
  },
  findSeasonal: function() {
    AppDispatcher.dispatch({
      actionType: InsightConstants.SEASONAL_REQUEST
    });
  },
  sendMessage: function(message) {
    AppDispatcher.dispatch({
      actionType: InsightConstants.SEND_MESSAGE,
      id: message
    })
  }

};

module.exports = InsightActions;
