var AppDispatcher = require('./../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var InsightConstants = require('./../constants/InsightConstants');
var assign = require('object-assign');
var $ = require('jquery');

var CHANGE_EVENT = 'change';

var data = {

	//the information on all the datasets
	dsCollectionList: [],
	dsCollectionIndex: null,

	//current dataset information
	dsCurrentLength: 0, //used for determing start and end positions in a subsequence

  //threshold:
	thresholdRange: [0.0, 1.0],
	thresholdCurrent: 0.3,
	thresholdStep: 0.1,

	//the view mode [similarity/seasonal/clustering]
	viewMode: InsightConstants.VIEW_MODE_SIMILARITY,
	sizing: {},

	//icon modes
	datasetIconMode: InsightConstants.ICON_DATASET_INIT_NULL,

};

/*
 * A counter for requestIDs to ensure last query is ultimately
 * used.
 */
var requestID = {
	datasetInit: 0,
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

		var h = html.clientHeight;
		var w = html.clientWidth;

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
		return data.dsCollectionList;
	},

	/**
	 * @return {Object} - the length of the dataset for how many different queries are possible
	 */
	getDSCurrentLength: function() {
		return data.dsCurrentLength;
	},

	/**
	 * @return {Object} - the range of the threshold
	 */
	getThresholdRange: function() {
		return data.thresholdRange;
	},

	/**
	 * @return {Number} - the current threshold
	 */
	getThresholdCurrent: function() {
		return data.thresholdCurrent;
	},

	/**
	 * @return {Number} - the current threshold
	 */
	getThresholdStep: function() {
		return data.thresholdStep;
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
	 * @return {Number} - the index of the current dataset
	 */
	getDSCollectionIndex: function() {
		return data.dsCollectionIndex;
	},

	/**
	 * @param {Int} - the index of the ds (file order)
	 */
	setDSCollectionIndex: function(dsCollectionIndex) {
		data.dsCollectionIndex = dsCollectionIndex;
	},

	/**
	 * @param {Int} - the current length of the DS
	 */
	setDSCurrentLength: function(dsCurrentLength) {
		data.dsCurrentLength = dsCurrentLength;
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
		data.thresholdCurrent = v;
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
				data.dsCollectionList = endlist;
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
		if ((data.dsCollectionIndex == null) || (data.thresholdCurrent == null) ){
			InsightStore.setDatasetIconMode(InsightConstants.ICON_DATASET_INIT_NULL);
			InsightStore.emitChange();
			console.log("index null, no need to req");
			return;
		}

		requestID.datasetInit += 1;

		$.ajax({
			url: '/dataset/init/',
			data: {
			  dsCollectionIndex : data.dsCollectionIndex,
				st : data.thresholdCurrent,
				requestID: requestID.datasetInit
			},
			dataType: 'json',
			success: function(response) {
				if (response.requestID != requestID.datasetInit) {
				    console.log(requestID, response.requestID);
				}
				data.dsCurrentLength = response.dsLength;
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
		default:
		  // no op
	}
});

module.exports = InsightStore;
