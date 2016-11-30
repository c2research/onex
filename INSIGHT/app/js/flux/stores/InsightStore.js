var AppDispatcher = require('./../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var InsightConstants = require('./../constants/InsightConstants');
var assign = require('object-assign');
var $ = require('jquery');

var CHANGE_EVENT = 'change';

var datasetData = {
  //the information on all the datasets
  dsCollectionList: [],
  dsCollectionIndex: null,

  //current dataset information
  dsCurrentLength: 0, //used for determing start and end positions in a subsequence
  dsCurrentSize: 0
};

var thresholdData = {
  thresholdRange: [0.0, 1.0],
  thresholdCurrent: 0.3,
  thresholdStep: 0.1,
};

var data = {

  //threshold:

  //the view mode [similarity/seasonal/clustering]
  viewMode: InsightConstants.VIEW_MODE_SIMILARITY,
  sizing: {},

  //icon modes
  datasetIconMode: InsightConstants.ICON_DATASET_INIT_NULL,

  //message
  message: {}

};

/*
 * A counter for requestIDs to ensure last query is ultimately
 * used.
 */
var requestID = {
  datasetInit: 0,
  fromDataset: 0
}

var InsightStore = assign({}, EventEmitter.prototype, {
  /**
   * emits a change event, which is registered in view controller
   */
  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  /**
   * @param {function} callback
   */
  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  /**
   * @param {function} callback
   */
  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  /**
   * call this while app is loading
   */
  init: function() {
    this.calculateDimensions();
    this.requestDatasetList();
  },

  /**
   * Calculate how big things are so its easy to keep
   * track, and format.
   */
  calculateDimensions: function(){
    var body = document.body,
        html = document.documentElement;

    var h = $(window).height();
    var w = $(window).width();

    var controlPanelWidth = 301; //data.similarityQueryInfo.qDatasetValues.length > 0 || data.similarityQueryInfo.qUploadValues.length > 0 ? 301 : 275;//we will change this later when
            //we can resize this etc
    var bannerHeight = 76; //hard code for now, get it later.

    //this sizing scheme puts the table of values inside the view
    var sizing = {
      controlPanelWidth: controlPanelWidth,
      bannerHeight: bannerHeight,
      displayHeight: h - bannerHeight,
      displayWidth: w - controlPanelWidth
    };

    data.sizing = sizing;
  },

  /**
   * @param {Object} - dimensions for the app
   * refer to function @calculateDimensions for attributes
   */
  getSizing: function() {
    return data.sizing;
  },

  /**
   * @param {Object} - the current representation of state data
   */
  getStateData: function() {
    return data;
  },

  /**
   * @return {Object} - return the list of datasets [{string, boolean}], name, preprocessed
   */
  getDSCollectionList: function() {
    return datasetData.dsCollectionList;
  },

  /**
   * @return {Object} - the length of the dataset for how many different queries are possible
   */
  getDSCurrentLength: function() {
    return datasetData.dsCurrentLength;
  },

  /**
   * @return {Object} - the range of the threshold
   */
  getThresholdRange: function() {
    return thresholdData.thresholdRange;
  },

  /**
     * @return {Number} - the current threshold
   */
  getThresholdCurrent: function() {
    return thresholdData.thresholdCurrent;
  },

  /**
   * @return {Number} - the current threshold
   */
  getThresholdStep: function() {
    return thresholdData.thresholdStep;
  },

  /**
   * @return {InsightConstants} - the current view mode
   */
  getViewMode: function() {
    return data.viewMode;
  },

  /**
   * @return {InsightConstant} - the current icon mode
   */
  getDatasetIconMode: function() {
    return data.datasetIconMode;
  },

  /**
   * @return {Object} - returns all the message data
   */
  getMessage: function() {
    return data.message;
  },

  /**
   * @return {Object} - returns all the dataset data
   */
  getDatasetData: function() {
    return datasetData;
  },
  getThresholdData: function() {
    return thresholdData;
  },
  getData: function() {
    return data;
  },

  /**
   * @param {Object} - sets all the message data
   */
  setMessage: function(title,icon,iconColor,color,message,visibility) {
    data.message = {
      title: title,
      icon: icon,
      iconColor: iconColor,
      color: color,
      message: message,
      visibility: visibility
    }
  },

  /**
   * @return {Number} - the index of the current dataset
   */
  getDSCollectionIndex: function() {
    return datasetData.dsCollectionIndex;
  },

  /**
   * @param {Int} - the index of the ds (file order)
   */
  setDSCollectionIndex: function(dsCollectionIndex) {
    datasetData.dsCollectionIndex = dsCollectionIndex;
  },

  /**
   * @param {Int} - the current length of the DS
   */
  setDSCurrentLength: function(dsCurrentLength) {
    datasetData.dsCurrentLength = dsCurrentLength;
  },

  /**
   * @param {InsightConstant} - the view mode to switch to
   */
  setViewMode: function(mode) {
    data.viewMode = mode;
  },

  /**
   * @param {Number} - the new current threshold
   */
  setThresholdCurrent: function(v) {
    thresholdData.thresholdCurrent = v;
  },

  /**
   * @param {InsightConstant} - sets the icon view mode (loading vs loaded)
   */
  setDatasetIconMode: function(mode) {
    data.datasetIconMode = mode;
  },
  /**
   * requests server to popluate datalist
   */
  requestDatasetList: function() {
    $.ajax({
      url: '/dataset/list',
      dataType: 'json',
      success: function(response) {
        var endlist = response.datasets.map(function(dataset, i) {
          return { value: i, label: dataset };
        })
        // Doing this so datasets can be labeled

        datasetData.dsCollectionList = endlist;
        InsightStore.emitChange();
      },
      error: function(xhr) {
        console.log("error requesting dataset list");
      }
    });
  },
  /**
   * initial request to the server for information on
   * a dataset
   */
  requestDatasetInit: function(callback) {
    if ((datasetData.dsCollectionIndex == null) || (thresholdData.thresholdCurrent == null) ){
      InsightStore.setDatasetIconMode(InsightConstants.ICON_DATASET_INIT_NULL);
      InsightStore.emitChange();
      console.log("index null, no need to req");
      return;
    }

    requestID.datasetInit += 1;

    $.ajax({
      url: '/dataset/init/',
      data: {
        dsCollectionIndex : datasetData.dsCollectionIndex,
        st : thresholdData.thresholdCurrent,
        requestID: requestID.datasetInit
      },
      dataType: 'json',
      success: function(response) {
        if (response.requestID != requestID.datasetInit) {
            console.log(requestID, response.requestID);
        }
        datasetData.dsCurrentLength = response.dsLength;
        InsightStore.setDatasetIconMode(InsightConstants.ICON_DATASET_INIT_LOADED);
        InsightStore.emitChange();

        callback();

      },
      error: function(xhr) {
        //TODO: later on, pop up a red message top-right corner that something failed
        console.log("error requesting dataset init");
      }
    });
  },

  /**
   * requests server for a sequence within the dataset
   */
  requestSequence: function(fromDataset, sequenceIndex, callback) {
    var dsCollectionIndex = InsightStore.getDSCollectionIndex();

    if ((dsCollectionIndex == null) || (sequenceIndex == null) ||
        (dsCollectionIndex < 0) || (sequenceIndex < 0)){
      console.log("dsCollectionIndex or qseq null, no need to req");
      return;
    }

    requestID.fromDataset += 1;

    $.ajax({
      url: '/query/fromdataset/',
      data: {
        dsCollectionIndex : fromDataset ? dsCollectionIndex : -1, //the index of the ds in memory on the server
        qSeq : sequenceIndex, //the index of the query in the list
        requestID : requestID.fromDataset
      },
      dataType: 'json',
      success: function(response) {
        if (response.requestID != requestID.fromDataset) {
          //its not smooth if you run on your own comp, but definitely need it
          //if someone else is using this. ill add another loading thing to make it more clear
          return;
        }

        var endlist = response.query.map(function(query, i) {
          return [i, query];
        });

        callback(endlist);
      },
      error: function(xhr) {
        //TODO: later on, pop up a red message top-right corner that something failed
        console.log("error in requesting query values");
      }
    });
  },
});

// Register callback to handle all updates
AppDispatcher.register(function(action) {
  switch(action.actionType) {
    case InsightConstants.RESIZE_APP:
      InsightStore.calculateDimensions()
      InsightStore.emitChange();
      break;
    case InsightConstants.SELECT_DS_INDEX:
      InsightStore.setDSCollectionIndex(action.id);
      InsightStore.emitChange();
      break;
    case InsightConstants.REQUEST_DATA_INIT:
      InsightStore.setDatasetIconMode(InsightConstants.ICON_DATASET_INIT_LOADING);
      InsightStore.emitChange();
      break;
    case InsightConstants.SELECT_THRESHOLD:
      InsightStore.setThresholdCurrent(action.id);
      InsightStore.emitChange();
      break;
    case InsightConstants.VIEW_MODE_SIMILARITY:
      InsightStore.setViewMode(action.actionType);
      InsightStore.emitChange();
      break;
    case InsightConstants.VIEW_MODE_SEASONAL:
      InsightStore.setViewMode(action.actionType);
      InsightStore.emitChange();
      break;
    case InsightConstants.VIEW_MODE_CLUSTER:
      InsightStore.setViewMode(action.actionType);
      InsightStore.emitChange();
      break;
    case InsightConstants.SEND_MESSAGE:
      InsightStore.setMessage(action.id[0], action.id[1], action.id[2], action.id[3], action.id[4], action.id[5]);
      InsightStore.emitChange();
      break;
    default:
      // no op
  }
});

module.exports = InsightStore;
