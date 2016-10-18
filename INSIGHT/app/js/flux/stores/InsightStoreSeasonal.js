var AppDispatcher = require('./../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var InsightConstants = require('./../constants/InsightConstants');
var InsightStore = require('./InsightStore');
var assign = require('object-assign');
var $ = require('jquery');

var CHANGE_EVENT = 'change';

var seasonalQueryInfo = {
  qSeq: 0,
  qLength: 1,
  currentPatternIndex: 0 
};

var seasonalResult = [];

var InsightStoreSeasonal = assign({}, EventEmitter.prototype, {

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  getSeasonalQueryInfo: function() {
    return seasonalQueryInfo;
  },

  setQSeq: function(seq) {
    seasonalQueryInfo.qSeq = seq;
  },

  setQLength: function(length) {
    seasonalQueryInfo.qLength = length;
  },

  setCurrentPatternIndex: function(index) {
    seasonalQueryInfo.currentPatternIndex = index;
  },

  requestSeasonal: function() {
    $.ajax({
      url: '/seasonal',
      data: {
        dsCollectionIndex: InsightStore.getDSCollectionIndex(),
        qSeq: seasonalQueryInfo.qSeq,
        length: seasonalQueryInfo.length,
        requestID: -1
      },
      dataType: 'json',
      success: function(response) {
        if (response.requestID != requestID.datasetInit) {
            console.log(requestID, response.requestID);
        }
        seasonalResult = response.seasonal;
        InsightStoreSeasonal.emitChange();
      },
      error: function(xhr) {
        //TODO: later on, pop up a red message top-right corner that something failed
        console.log("error requesting seasonal");
      });
  }


});

// Register callback to handle all updates
AppDispatcher.register(function(action) {
  switch(action.actionType) {
    case InsightConstants.SEASONAL_SELECT_QUERY:
      InsightStoreSeasonal.setQSeq(action.id);
      InsightStoreSeasonal.emitChange();
      break;
    case SEASONAL_SELECT_LENGTH:
      InsightStoreSeasonal.setQLength(action.id);
      InsightStoreSeasonal.emitChange();
      break;
    case SEASONAL_SELECT_PATTERN_INDEX:
      InsightStoreSeasonal.setCurrentPatternIndex(action.id);
      InsightStoreSeasonal.emitChange();
      break;
    case SEASONAL_REQUEST:
      InsightStoreSeasonal.requestSeasonal();
      break;
    default:
      // no op
  }
});

module.exports = InsightStoreSeasonal;