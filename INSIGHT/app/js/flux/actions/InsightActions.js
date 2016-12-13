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
   * initiates function seq to change view mode
   */
  selectViewMode: function(mode) {
    AppDispatcher.dispatch({
      actionType: mode,
      id: 0
    });
  },
  selectDSIndex: function(index) {
    AppDispatcher.dispatch({
      actionType: InsightConstants.SELECT_DS_INDEX,
      id: index
    });
  },
  selectDistance: function(index) {
    AppDispatcher.dispatch({
      actionType: InsightConstants.SELECT_DISTANCE,
      id: index
    });
  },
  /**
   * initiates function to select a threshold
   */
  selectThreshold: function(val) {
    AppDispatcher.dispatch({
      actionType: InsightConstants.SELECT_THRESHOLD,
      id: val
    });
  },
  /**
   * initiates function to process a data set
   */
  requestDatasetInit: function() {
    AppDispatcher.dispatch({
      actionType: InsightConstants.REQUEST_DATA_INIT,
      id: 1
    });
  },
  selectQueryLocation: function(value) {
    AppDispatcher.dispatch({
      actionType: value
    });
  },
  uploadQueryFile: function(files) {
    AppDispatcher.dispatch({
      actionType: InsightConstants.UPLOAD_QUERY_FILE,
      id: files
    });
  },
  selectSimilarityQuery: function(index) {
    AppDispatcher.dispatch({
      actionType: InsightConstants.SIMILARITY_SELECT_QUERY,
      id: index
    });
  },
  selectGroup: function(index) {
    AppDispatcher.dispatch({
      actionType: InsightConstants.SELECT_GROUP,
      id: index
    });
  },
  selectGroupSequence: function(index) {
    AppDispatcher.dispatch({
      actionType: InsightConstants.SELECT_GROUP_SEQUENCE,
      id: index
    });
  },
  toggleGroupView: function() {
    AppDispatcher.dispatch({
      actionType: InsightConstants.TOGGLE_GROUP_VIEW,
      id: -1
    });
  },
  loadGroupSequence: function() {
    AppDispatcher.dispatch({
      actionType: InsightConstants.LOAD_GROUP_SEQUENCE,
    })
  },
  /**
   * load the current selected query
   */
  loadSimilarityQuery: function() {
    AppDispatcher.dispatch({
      actionType: InsightConstants.SIMILARITY_LOAD_QUERY
    });
  },

  selectPreviewRange: function(range) {
    AppDispatcher.dispatch({
      actionType: InsightConstants.SIMILARITY_SELECT_PREVIEW_RANGE,
      id: range
    });
  },
  /**
   * initiates function to change graphTypeList
   */
  selectGraphType: function(mode) {
    AppDispatcher.dispatch({
      actionType: mode,
    });
  },
  /*
   * initiates funciton to find similarity match
   */
  findMatch: function() {
    AppDispatcher.dispatch({
      actionType: InsightConstants.FIND_MATCH,
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
