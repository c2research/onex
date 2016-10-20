var AppDispatcher = require('./../dispatcher/AppDispatcher');
var InsightConstants = require('./../constants/InsightConstants');
var InsightStore = require('./InsightStore');
var assign = require('object-assign');
var $ = require('jquery');

var CHANGE_EVENT = 'change';

var seasonalQueryInfo = {
  qSeq: 0,
  qLength: 1,
  qValues: []
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

  setQSeq: function(seq) {
    seasonalQueryInfo.qSeq = seq;
  },

  setQLength: function(length) {
    seasonalQueryInfo.qLength = length;
  },

  setQValues: function(values) {
    seasonalQueryInfo.qValues = values;
  },

  setShowingPatternIndex: function(index) {
    if (0 <= index && index < seasonalResult.patterns.length) {
      seasonalResult.showingPatternIndex = index;
    }
  },

  requestQueryFromDataset: function() {
    InsightStore.requestSequenceFromDataset(seasonalQueryInfo.qSeq, 
      function(endlist) {
        InsightStoreSeasonal.setQValues(endlist);
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
          InsightStoreSeasonal.setQSeq(0);
          InsightStoreSeasonal.requestQueryFromDataset();
        });
      }
      break;
    case InsightConstants.SEASONAL_SELECT_QUERY:
      InsightStoreSeasonal.setQSeq(action.id);
      InsightStoreSeasonal.requestQueryFromDataset();
      break;
    case InsightConstants.SEASONAL_SELECT_LENGTH:
      InsightStoreSeasonal.setQLength(action.id);
      InsightStore.emitChange();
      break;
    case InsightConstants.SEASONAL_SELECT_PATTERN_INDEX:
      InsightStoreSeasonal.setShowingPatternIndex(action.id);
      InsightStore.emitChange();
      break;
    case InsightConstants.SEASONAL_REQUEST:
      InsightStore.requestSeasonal();
      break;
    default:
      // no op
  }
});

module.exports = InsightStoreSeasonal;
