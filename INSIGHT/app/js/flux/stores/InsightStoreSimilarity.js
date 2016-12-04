var AppDispatcher = require('./../dispatcher/AppDispatcher');
var InsightStore = require('./InsightStore');
var InsightConstants = require('./../constants/InsightConstants');
var assign = require('object-assign');
var $ = require('jquery');

var TimeSeries = require('./../../TimeSeries');

var CHANGE_EVENT = 'change';

var queryListViewData = {
  queryLocation: InsightConstants.QUERY_LOCATION_DATASET,
  // A list of names of the time series
  queryListDataset: [],
  queryListUpload: [],
  querySelectedIndexDataset: -1,
  querySelectedIndexUpload: -1,
};

var groupViewData = {
  // A list of TimeSeries
  showingRepresentatives: true,
  groupList: [],
  groupSelectedIndex: -1
};

var previewData = {
  // A TimeSeries
  previewSequence: null, //new TimeSeries([[0, 0.1], [1, 0.15], [2, 0.1], [3, 0.16], [4, 0.11], [5, 0.2], [6, 0.2], [7, 0.21], [8, 0.22], [9, 0.2], [10, 0.16], [11, 0.14], [12, 0.11], [13, 0.1], [14, 0.09], [15, 0.07], [16, 0.09], [17, 0.06], [18, 0.04]], '', 1, 1, 0, 18),
  previewRange: []
};

var resultViewData = {
  graphType: InsightConstants.GRAPH_TYPE_WARP,
  dtwBias: 0,
  selectedSubsequence: null,//new TimeSeries([[1, 0.5], [2, 0.2], [3, 0.5], [4, 0.2], [5, 0.5]], '', 2, 1, 1, 5),
  selectedMatch: null, //new TimeSeries([[4, 0.5], [5, 0.1], [6, 0.4], [7, 0.3], [8, 0.5]], '', 2, 3, 4, 8),
  warpingPath: []
};

/*
 * A counter for requestIDs to ensure last query is ultimately used.
 */
var requestID = {
  findMatch: 0,
  uploadQuery: 0,
  requestGroupRepresentatives: 0,
  datasetQueries: 0
}

var InsightStoreSimilarity = assign({}, {

  fillQueryListFromDataset: function() {
    //TODO: update this to request all the queries
    queryListViewData.queryListDataset = [];
    var name = InsightStore.getDSCollectionList()[InsightStore.getDSCollectionIndex()].label;
    for (var i = 0; i < InsightStore.getDSCurrentLength(); i++) {
        queryListViewData.queryListDataset.push(name + " - " + i);
    }
    queryListViewData.querySelectedIndexDataset = -1;
  },

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
        // TODO: Modify that server to support this
        querySetSize = response.querySetSize;
        for (var i = 0; i < querySetSize; i++) {
          queryListViewData.queryListDataset.push("Sequence " + i);
        }
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
    var fromDataset = queryListViewData.queryLocation == InsightConstants.QUERY_LOCATION_DATASET;
    var selectedQuery = fromDataset ? queryListViewData.querySelectedIndexDataset :
                                      queryListViewData.querySelectedIndexUpload;
    var queryName = fromDataset ? queryListViewData.queryListDataset[selectedQuery] :
                                  queryListViewData.queryListDataset[selectedQuery];
    InsightStore.requestSequence(fromDataset, selectedQuery,
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

    var qStart, qEnd, qSeq, qTypeLocal, qValues, qType;
    var previewSequence = previewData.previewSequence;
    qStart = previewData.previewRange[0];
    qEnd = previewData.previewRange[1];
    qSeq = previewSequence.getSeq();
    qType = previewSequence.getLocation();
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
          qType: qType, //the type of query, 0->dataset, 1->from file
          qSeq: qSeq, //the index of q in its ds
          qStart: qStart,
          qEnd: qEnd,
          requestID: requestID.findMatch
      },
      dataType: 'json',
      currentState: {
        qType: qType,
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

          var resultTimeSeries = new TimeSeries(endlist, '',
                                                currentState.qType,
                                                response.seq,
                                                response.start,
                                                response.end);
          // TODO: currently not switching view to group
          // groupViewData.groupList = [resultTimeSeries];
          // groupViewData.groupSelectedIndex = 0;
          // groupViewData.showingRepresentatives = false;
          resultViewData.selectedMatch = resultTimeSeries;
          resultViewData.warpingPath = response.warpingPath; //[[95, 42], [94, 42], [93, 42], [92, 42], [91, 42], [90, 42], [89, 42], [88, 42], [87, 42], [86, 42], [85, 42], [84, 42], [83, 42], [82, 42], [81, 42], [80, 42], [79, 42], [78, 42], [77, 42], [76, 42], [75, 42], [74, 42], [73, 42], [72, 42], [71, 42], [70, 42], [69, 42], [68, 42], [67, 42], [66, 41], [65, 41], [64, 41], [63, 41], [62, 41], [61, 41], [60, 41], [59, 41], [58, 41], [57, 41], [56, 41], [55, 40], [54, 40], [53, 39], [52, 39], [51, 38], [50, 37], [49, 36], [48, 35], [47, 34], [46, 33], [46, 32], [45, 31], [44, 30], [43, 29], [42, 29], [41, 29], [40, 29], [39, 28], [39, 27], [39, 26], [38, 25], [37, 24], [36, 23], [36, 22], [36, 21], [35, 20], [35, 19], [34, 18], [33, 17], [32, 16], [31, 15], [30, 14], [29, 14], [28, 13], [27, 12], [26, 11], [26, 10], [26, 9], [26, 8], [26, 7], [26, 6], [25, 5], [24, 5], [23, 5], [22, 5], [21, 4], [21, 3], [21, 2], [20, 1], [19, 1], [18, 0], [17, 0], [16, 0], [15, 0], [14, 0], [13, 0], [12, 0], [11, 0], [10, 0], [9, 0], [8, 0], [7, 0], [6, 0], [5, 0], [4, 0], [3, 0], [2, 0], [1, 0], [0, 0]]
          // var result = { //structure of query result pair
          //   qTypeLocal: currentState.qTypeLocal,
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
        groupViewData.showingRepresentatives = true;
        groupViewData.groupList = response.representatives.map(function(tuple, i) {
          var [array, count] = tuple;
          var values = array.map(function(x, j) { return [j,x]});
          return new TimeSeries(values, 100 * (count / length) ,InsightConstants.QUERY_LOCATION_DATASET,
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
                                                array.length);
        });

        queryListViewData.queryLocation = InsightConstants.QUERY_LOCATION_DATASET;
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

          InsightStoreSimilarity.requestDatasetQueries();//requestDatasetQueries fillQueryListFromDataset
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
