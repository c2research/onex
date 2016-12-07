var AppDispatcher = require('./../dispatcher/AppDispatcher');
var InsightStore = require('./InsightStore');
var InsightConstants = require('./../constants/InsightConstants');
var assign = require('object-assign');
var $ = require('jquery');

var TimeSeries = require('./../../TimeSeries');

var CHANGE_EVENT = 'change';

var queryListViewData = {
  queryLocation: InsightConstants.QUERY_LOCATION_DATASET,
  // A list of time series
  queryListDataset: [],
  queryListUpload: [],
  querySelectedIndexDataset: -1,
  querySelectedIndexUpload: -1,
};

var previewData = {
  // A TimeSeries
  previewSequence: null,
  previewRange: []
};

//TODO: on a match switch showingRepresentatives to false,
//      on dataset process switch showingRepresentatives to true
var groupViewData = {
  // A list of TimeSeries
  showingRepresentatives: true,
  groupList: [],
  groupSelectedIndex: -1
};

var previewData = {
  // A TimeSeries
  previewSequence: null,
  previewRange: []
};

var resultViewData = {
  graphType: InsightConstants.GRAPH_TYPE_WARP,
  dtwBias: 0,
  selectedSubsequence: null,
  selectedMatch: null,
  warpingPath: []
};

/*
 * A counter for requestIDs to ensure last query is ultimately used.
 */
var requestID = {
  findMatch: 0,
  requestGroupRepresentatives: 0,
  datasetQueries: 0
}

var InsightStoreSimilarity = assign({}, {

  /**
   * @param {InsightConstant} - the current query type
   */
  setQueryLocation: function(v) {
    queryListViewData.queryLocation = v;
  },

  /**
   * requests server upload a file
   */
  uploadQuery: function(files) {
    var formData = new FormData();
    $.each(files, function(key, value) {
      formData.append('query', value);
    })
    $.ajax({
      url: '/query/upload',
      data: formData,
      type: 'POST',
      processData: false,
      contentType: false,
      success: function(response) {
        var name = files[0].name;
        queryListViewData.queryListUpload = response.queries.map(function(array, i) {
          var values = array.map(function(x, j) { return [j,x]});
          return new TimeSeries(values, name + " - " + i ,
                                                InsightConstants.QUERY_LOCATION_UPLOAD,
                                                i,
                                                0,
                                                array.length - 1);
        });

        queryListViewData.queryLocation = InsightConstants.QUERY_LOCATION_UPLOAD;
        queryListViewData.querySelectedIndexUpload = -1;

        InsightStore.emitChange();
      },
      error: function(xhr) {
        //TODO: later on, pop up a red message top-right corner that something failed
        console.log("error in uploading query");
      }
    });
  },

  setQuerySelectedIndexDataset: function(i) {
    queryListViewData.querySelectedIndexDataset = i;
  },

  setQuerySelectedIndexUpload: function(i) {
    queryListViewData.querySelectedIndexUpload = i;
  },

  getQueryListViewData: function() {
    return queryListViewData;
  },

  requestQuery: function() {
    var fromDataset = (queryListViewData.queryLocation == InsightConstants.QUERY_LOCATION_DATASET) + 0;

    var selectedQuery = fromDataset ? queryListViewData.querySelectedIndexDataset :
                                      queryListViewData.querySelectedIndexUpload;
    var queryName = fromDataset ? queryListViewData.queryListDataset[selectedQuery] :
                                  queryListViewData.queryListUpload[selectedQuery];
    InsightStore.requestSequence(fromDataset + 0, selectedQuery,
      function(endlist) {
        var newTimeSeries = new TimeSeries(endlist,
                                           queryName,
                                           1 - fromDataset,
                                           selectedQuery,
                                           0,
                                           endlist.length - 1);
        previewData.previewSequence = newTimeSeries;
        previewData.previewRange = [0, endlist.length - 1];
        InsightStore.emitChange();
       }
    );
  },

  setPreviewRange: function(array) {
    previewData.previewRange = array;
  },

  getPreviewData: function() {
    return previewData;
  },

  /**
   * @param {InsightConstants} - the graph type to be set
   */
  setGraphType: function(type) {
    resultViewData.graphType = type;
  },

  /**
   * sets the dtw bias
   * @param {Number} - the value to be set to
   */
  setDTWBias: function(value) {
    resultViewData.dtwBias = parseInt(value, 10);
  },

  /**
   * requests server to find the answer
   */
  requestFindMatch: function() {
    if (previewData.previewSequence === null) {
      return;
    }

    var qStart, qEnd, qSeq, qValues, qFindWithCustomQuery;
    var previewSequence = previewData.previewSequence;
    qStart = previewData.previewRange[0];
    qEnd = previewData.previewRange[1];
    qSeq = previewSequence.getSeq();
    qFindWithCustomQuery = previewSequence.getLocation();
    qValues = previewSequence;

    // Clear result view
    resultViewData.selectedSubsequence = previewSequence.slice(qStart, qEnd + 1);
    resultViewData.selectedMatch = null;
    resultViewData.warpingPath = [];
    InsightStore.emitChange();

    var dsCollectionIndex = InsightStore.getDSCollectionIndex();

    requestID.findMatch += 1;
    $.ajax({
      url: '/query/find/',
      data: {
          dsCollectionIndex: dsCollectionIndex, //the index of the ds in memory on the server we querying
          qFindWithCustomQuery: qFindWithCustomQuery, //the type of query, 0->dataset, 1->from file
          qSeq: qSeq, //the index of q in its ds
          qStart: qStart,
          qEnd: qEnd,
          requestID: requestID.findMatch
      },
      dataType: 'json',
      currentState: {
        qFindWithCustomQuery: qFindWithCustomQuery,
        qSeq: qSeq,
        qStart: qStart,
        qEnd: qEnd,
        qValues: qValues,
        threshold: InsightStore.getThresholdCurrent(),
        qDsCollectionIndex: dsCollectionIndex
      },
      success: function(response) {
          if (response.requestID != requestID.findMatch){
            console.log(response, requestID);
            return;
          }

          var currentState = this.currentState;

          var endlist = response.result.map(function(val, i) {
            return [i + response.start, val];
          });
          var name = InsightStore.getDSCollectionList()[InsightStore.getDSCollectionIndex()].label;
          var resultTimeSeries = new TimeSeries(endlist, name,
                                                currentState.qFindWithCustomQuery,
                                                response.seq,
                                                response.start,
                                                response.end);

           // TODO: currently not switching view to group
          // groupViewData.groupList = [resultTimeSeries];
          // groupViewData.groupSelectedIndex = 0;
          // groupViewData.showingRepresentatives = false;
          resultViewData.selectedMatch = resultTimeSeries;
          resultViewData.warpingPath = response.warpingPath;
          // var result = { //structure of query result pair
          //   qSeq: currentState.qSeq,
          //   qStart: currentState.qStart,
          //   qEnd: currentState.qEnd,
          //   qValues: currentState.qValues,
          //   qThreshold: currentState.threshold,
          //   qDistanceType: null,
          //   qDsCollectionIndex: currentState.qDsCollectionIndex,
          //   rSeq: response.seq,
          //   rStart: response.start,
          //   rEnd: response.end,
          //   rValues: endlist,
          //   dsName: response.dsName,
          //   warpingPath: response.warpingPath,
          //   similarityValue: response.dist
          // }
          // InsightStoreSimilarity.addQueryResultPair(result);//response.result.warpingPath,
          InsightStore.emitChange();
      },
      error: function(xhr) {
        //TODO: later on, pop up a red message top-right corner that something failed
        console.log("error in finding answer");
      }
    });
  },

  setGroupSelectedIndex: function(i) {
    groupViewData.groupSelectedIndex = i;
  },

  getGroupViewData: function() {
    return groupViewData;
  },

  /**
   * gets the dtw bias
   */
  getResultViewData: function() {
    return resultViewData;
  },

  /*
   * clears data to maintain flow
   */
  clearResultViewData: function() {
    resultViewData.dtwBias = 0;
    resultViewData.selectedMatch = null;
    resultViewData.selectedSubsequence = null;
    resultViewData.warpingPath = [];
  },
  clearPreviewData: function() {
    previewData.previewSequence = null;
    previewData.previewRange = [];
  },

  /**
   * initial request to the server for information on
   * a dataset
   */
  requestGroupRepresentatives: function() {
    var dsCollectionIndex = InsightStore.getDSCollectionIndex();

    if (dsCollectionIndex == null){
      console.log("index null, no need to req");
      return;
    }

    requestID.requestGroupRepresentatives += 1;

    $.ajax({
      url: '/representatives',
      data: {
        dsCollectionIndex : dsCollectionIndex,
        requestID: requestID.requestGroupRepresentatives
      },
      dataType: 'json',
      success: function(response) {
        if (response.requestID != requestID.requestGroupRepresentatives) {
            console.log(requestID, response.requestID);
        }
        var length = queryListViewData.queryListDataset.length;
        groupViewData.groupSelectedIndex = -1;
        groupViewData.showingRepresentatives = true;
        groupViewData.groupList = response.representatives.map(function(tuple, i) {
          var [array, count] = tuple;
          var values = array.map(function(x, j) { return [j,x]});
          return new TimeSeries(values, (count / length),
                                                0,
                                                i,
                                                0,
                                                array.length);
        });
        InsightStore.emitChange();
      },
      error: function(xhr) {
        //TODO: later on, pop up a red message top-right corner that something failed
        console.log("error requesting dataset init");
      }
    });
  },

  /**
   * initial request to the server for information on
   * a dataset
   */
  requestDatasetQueries: function() {
    var dsCollectionIndex = InsightStore.getDSCollectionIndex();

    if (dsCollectionIndex == null){
      console.log("index null, no need to req");
      return;
    }

    requestID.datasetQueries += 1;

    $.ajax({
      url: '/dataset/queries',
      data: {
        requestID: requestID.datasetQueries
      },
      dataType: 'json',
      success: function(response) {
        if (response.requestID != requestID.datasetQueries) {
            console.log(requestID, response.requestID);
        }
        var name = InsightStore.getDSCollectionList()[InsightStore.getDSCollectionIndex()].label;
        queryListViewData.queryListDataset = response.queries.map(function(array, i) {
          var values = array.map(function(x, j) { return [j,x]});
          return new TimeSeries(values, name + " - " + i ,InsightConstants.QUERY_LOCATION_DATASET,
                                                i,
                                                0,
                                                array.length - 1);
        });

        queryListViewData.querySelectedIndexDataset = -1;

        InsightStore.emitChange();
      },
      error: function(xhr) {
        //TODO: later on, pop up a red message top-right corner that something failed
        console.log("error requesting dataset init");
      }
    });
  }

});

// Register callback to handle all updates
AppDispatcher.register(function(action) {
  switch(action.actionType) {
    case InsightConstants.REQUEST_DATA_INIT:
      if (InsightStore.getViewMode() == InsightConstants.VIEW_MODE_SIMILARITY) {
        InsightStore.requestDatasetInit(function() {
          // Fill the query list
          InsightStoreSimilarity.clearResultViewData();
          InsightStoreSimilarity.clearPreviewData();

          InsightStoreSimilarity.requestDatasetQueries();
          InsightStoreSimilarity.requestGroupRepresentatives();

          InsightStore.emitChange();
        });
      }
      break;

    case InsightConstants.QUERY_LOCATION_UPLOAD:
    case InsightConstants.QUERY_LOCATION_DATASET:
      InsightStoreSimilarity.setQueryLocation(action.actionType);
      InsightStore.emitChange();
      break;

    case InsightConstants.UPLOAD_QUERY_FILE:
      InsightStoreSimilarity.uploadQuery(action.id);
      break;

    case InsightConstants.SIMILARITY_SELECT_GROUP:
      InsightStoreSimilarity.setGroupSelectedIndex(action.id);
      InsightStore.emitChange();
      break;

    case InsightConstants.SIMILARITY_SELECT_QUERY:

      if (queryListViewData.queryLocation != action.id) {
        InsightStoreSimilarity.clearResultViewData();
        InsightStoreSimilarity.clearPreviewData();
      }

      if (queryListViewData.queryLocation == InsightConstants.QUERY_LOCATION_DATASET) {
        InsightStoreSimilarity.setQuerySelectedIndexDataset(action.id)
      } else {
        InsightStoreSimilarity.setQuerySelectedIndexUpload(action.id)
      }

      InsightStore.emitChange();
      break;

    case InsightConstants.SIMILARITY_LOAD_QUERY:
      InsightStoreSimilarity.requestQuery();
      break;

    case InsightConstants.SIMILARITY_SELECT_PREVIEW_RANGE:
      InsightStoreSimilarity.setPreviewRange(action.id);
      InsightStore.emitChange();
      break;

    case InsightConstants.FIND_MATCH:
      InsightStoreSimilarity.requestFindMatch();
      break;

    case InsightConstants.SIMILARITY_SELECT_RESULT:
      InsightStoreSimilarity.setGroupSelectedIndex(action.id);
      InsightStore.emitChange();
      break;

    case InsightConstants.SELECT_DTW_BIAS:
      InsightStoreSimilarity.setDTWBias(action.id);
      InsightStore.emitChange();
      break;
    case InsightConstants.GRAPH_TYPE_LINE:
    case InsightConstants.GRAPH_TYPE_HORIZON:
    case InsightConstants.GRAPH_TYPE_CONNECTED:
    case InsightConstants.GRAPH_TYPE_ERROR:
    case InsightConstants.GRAPH_TYPE_SPLIT:
    case InsightConstants.GRAPH_TYPE_RADIAL:
    case InsightConstants.GRAPH_TYPE_WARP:
      InsightStoreSimilarity.setGraphType(action.actionType);
      InsightStore.emitChange();
      break;
    default:
      // no op
  }
});

module.exports = InsightStoreSimilarity;
