var AppDispatcher = require('./../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var InsightConstants = require('./../constants/InsightConstants');
var assign = require('object-assign');
var $ = require('jquery');

var CHANGE_EVENT = 'change';

var MAX_RANDOM_QUERIES = 5;//recycle after 5

var data = {
	controlPanelVisible: true,
	datasetList: [],
	datasetCurrentSet: [],
	datasetCurrentIndex: -1,
	queryList: [],
	queryCurrentIndex: -1,
	distanceList: [],
	distanceCurrentIndex: 0,
	thresholdRange: [0.001, 1.000],
	thresholdCurrent: 0.01,
	thresholdStep: 0.001
};

/**
 * Notes:
 * The query list will consist of:
 		* All time series from set
		* All sample queries for a dataset
		* All random queries
		queryCurrentIndex = 0-2, index
		QueryList = {
		  sampleList = [[{}...]... ],
			randomList = [[{}]...],
			//the current list is derived from the current dataset
	  }
 */

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
	 * @param {Object} - the current representation of state data
	 */
	getStateData: function() {
		return data;
	},

	/**
	 * @return {boolean} - if app should render the control panel
	 */
	getControlPanelVisible: function() {
		return data.controlPanelVisible;
	},

	/**
	 * @return {Object} - return the list of datasets [{string, boolean}], name, preprocessed
	 */
	getDatasetList: function() {
		return data.datasetList;
	},

	/**
	 * @return {Number} - the index of the current dataset
	 */
	getDatasetCurrentIndex: function() {
		return data.datasetCurrentIndex;
	},

	/**
	 * @return {Object} - the actual current dataset
	 */
	getDatasetCurrentSet: function() {
		return data.datasetCurrentSet;
	},

	/**
	 * @return {Number} - the index of the current query
	 */
	getQueryCurrentIndex: function() {
		return data.queryCurrentIndex;
	},

	/**
	 * @return {Object} - the index of the current query
	 */
	getQueryList: function() {
		return data.queryList;
	},

	/**
	 * @return {Object} - the list of the distance
	 */
	getDistanceList: function() {
		return data.queryCurrentIndex;
	},

	/**
	 * @return {Number} - the index of the current index
	 */
	getDistanceCurrentIndex: function() {
		return data.queryCurrentIndex;
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
	 * @param {boolean} value - if app should render the control panel
	 */
	setControlPanelVisible: function(value) {
		data.controlPanelVisible = value;
	},

	/**
	 * @param {Number} - the new index of the current dataset
	 */
	setDatasetCurrentIndex: function(index) {
	  data.datasetCurrentIndex = index;
		data.queryList[0] = data.datasetCurrentSet;
	},

	/**
	 * @param {Number} - the new index of the current query
	 */
	setQueryCurrentIndex: function(v) {
		data.queryCurrentIndex = v;
	},

	/**
	 * @param {Number} - the new current threshold
	 */
	setThresholdCurrent: function(v) {
		data.thresholdCurrent = v;
	},

	/**
	 * @param {Number} - the new index of the current index
	 */
	setDistanceCurrentIndex: function(v) {
		data.queryCurrentIndex = v;
	},

	/**
	 * requests server to popluate datalist
	 */
	requestDatasetList: function() {
		$.ajax({
			url: '/_datasetlist',
			dataType: 'json',
			success: function(response) {
				data.datasetList = response;
				this.emitChange();
			},
			error: function(xhr) {
				console.log("error in outlierUpdateChart");
			}
		});
	},

	/**
	 * requests server to popluate current dataset
	 */
	requestDatasetCurrentSet: function(index) {
		$.ajax({
			url: '/_datasetlist',
			data: index,
			dataType: 'json',
			success: function(response) {
				data.selectedDataset = index;
				data.datasetCurrentSet = response;
				this.emitChange();
			},
			error: function(xhr) {
				console.log("error in outlierUpdateChart");
			}
		});
	},

	/**
	 * requests server to popluate current distance function list
	 */
	requestDistanceList: function() {
		$.ajax({
			url: '/_distanceList',
			data: index,
			dataType: 'json',
			success: function(response) {
				data.distanceList = response;
				this.emitChange();
			},
			error: function(xhr) {
				console.log("error in distance");
			}
		});
	},

	/**
	 * requests server to popluate current dataset
	 */
	requestRandomQuery: function() {
		$.ajax({
			url: '/query/random/',
			data: index,
			dataType: 'json',
			success: function(response) {
				if (data.queryList.randomList > MAX_RANDOM_QUERIES){
				  data.queryList.randomList.splice(0,1);//remove the first item
				}
				data.queryList.randomList.push(response);
				this.emitChange();
			},
			error: function(xhr) {
				console.log("error in random q");
			}
		});
	},

	/**
	 * requests server to popluate current dataset
	 */
	requestSampleQuery: function(index) {
		$.ajax({
			url: '/query/sample/',
			data: index,
			dataType: 'json',
			success: function(response) {
				data.queryList.sampleList = response;
				this.emitChange();
			},
			error: function(xhr) {
				console.log("error in sample q");
			}
		});
	}




});

// Register callback to handle all updates
AppDispatcher.register(function(action) {

	switch(action.actionType) {
		case InsightConstants.DISPLAY_TS:
			//doStuff()
			//InsightStore.emitChange();
			break;
		case InsightConstants.RESIZE_APP:
			//calculateDimensions()
			//InsightStore.emitChange();
			break;
		case InsightConstants.CONTROL_PANEL_VISIBLE:
			//if(InsightStore.emitChange();
			break;
		case InsightConstants.REQUEST_RANDOM:
			//if(InsightStore.emitChange();
			break;
		case InsightConstants.SELECT_DATASET_INDEX:
			//if(InsightStore.emitChange();
			break;
		case InsightConstants.SELECT_QUERY:
			//if(InsightStore.emitChange();
			//[0, index] -> from set
			//[1, index] -> from sample
			//[2, index] -> from random
			break;
		case InsightConstants.SELECT_DISTANCE:
			break;
		case InsightConstants.SELECT_THRESHOLD:
			break;

		default:
		  // no op
		}
});

module.exports = InsightStore;
