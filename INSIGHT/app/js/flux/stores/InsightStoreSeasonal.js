var AppDispatcher = require('./../dispatcher/AppDispatcher');
var InsightConstants = require('./../constants/InsightConstants');
var InsightStore = require('./InsightStore');
var assign = require('object-assign');
var $ = require('jquery');

var TimeSeries = require('./../../TimeSeries');

var CHANGE_EVENT = 'change';

var seasonalQueryInfo = {
  seq: 0,
  length: 3,
  ts: null,
};

var seasonalResult = {
  patterns: [],
  showingPatternIndex: 0
};

var InsightStoreSeasonal = assign({}, {

  getSeasonalQueryInfo: function() {
    return seasonalQueryInfo;
  },

  getResults: function() {
    return seasonalResult;
  },

  setSeq: function(seq) {
    seasonalQueryInfo.seq = seq;
  },

  setLength: function(length) {
    seasonalQueryInfo.length = length;
  },

  setTS: function(ts) {
    seasonalQueryInfo.ts = ts;
  },

  clearResult: function() {
    seasonalResult.patterns = [];
    seasonalResult.showingPatternIndex = 0;
  },

  setShowingPatternIndex: function(index) {
    if (0 <= index && index < seasonalResult.patterns.length) {
      seasonalResult.showingPatternIndex = index;
    }
  },

  requestQueryFromDataset: function() {
    var seq = seasonalQueryInfo.seq;
    InsightStore.requestSequence(1, seq, -1, -1,
      function(endlist) {
        var newTimeSeries = new TimeSeries(endlist, "", 0, seq, 0, endlist.length - 1);
        InsightStoreSeasonal.setTS(newTimeSeries);
        InsightStore.calculateDimensions();
        InsightStore.emitChange();
       }
    );
  },

  requestSeasonal: function() {
    $.ajax({
      url: '/seasonal',
      data: {
        dsCollectionIndex: InsightStore.getDSCollectionIndex(),
        qSeq: seasonalQueryInfo.seq,
        length: seasonalQueryInfo.length,
        requestID: -1
      },
      dataType: 'json',
      success: function(response) {
        seasonalResult.patterns = response.seasonal;
        seasonalResult.showingPatternIndex = 0;
        InsightStore.emitChange();
      },
      error: function(xhr) {
        //TODO: later on, pop up a red message top-right corner that something failed
        console.log("error requesting seasonal");
      }
    });
  }

});

// Register callback to handle all updates
AppDispatcher.register(function(action) {
  switch(action.actionType) {
    case InsightConstants.REQUEST_DATA_INIT:
      if (InsightStore.getViewMode() == InsightConstants.VIEW_MODE_SEASONAL) {
        InsightStore.requestDatasetInit(function() {
          InsightStoreSeasonal.clearResult();
          InsightStoreSeasonal.setSeq(0);
          InsightStoreSeasonal.requestQueryFromDataset();
        });
      }
      break;
    case InsightConstants.SEASONAL_SELECT_QUERY:
      InsightStoreSeasonal.clearResult();
      InsightStoreSeasonal.setSeq(action.id);
      InsightStore.emitChange();
      break;
    case InsightConstants.SEASONAL_LOAD_QUERY:
      InsightStoreSeasonal.requestQueryFromDataset();
      break;
    case InsightConstants.SEASONAL_SELECT_LENGTH:
      InsightStoreSeasonal.setLength(action.id);
      InsightStore.emitChange();
      break;
    case InsightConstants.SEASONAL_SELECT_PATTERN_INDEX:
      InsightStoreSeasonal.setShowingPatternIndex(action.id);
      InsightStore.emitChange();
      break;
    case InsightConstants.SEASONAL_REQUEST:
      InsightStoreSeasonal.requestSeasonal();
      break;
    default:
      // no op
  }
});

module.exports = InsightStoreSeasonal;
