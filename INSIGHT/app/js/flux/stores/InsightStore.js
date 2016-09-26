var AppDispatcher = require('./../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var InsightConstants = require('./../constants/InsightConstants');
var assign = require('object-assign');
var $ = require('jquery');

var InsightConstants = require('./../constants/InsightConstants');

var CHANGE_EVENT = 'change';

var MAX_RANDOM_QUERIES = 5;//recycle after 5

var data = {

	//the information on all the datasets
	dsCollectionList: [],
	dsCollectionIndex: null,

	//current dataset information
	dsCurrentLength: 0, //used for determing start and end positions in a subsequence

	//query information
	qIndex: -1, //use this later for q from diff sets
	qSeq: "",
	qStart: 0,
	qEnd: -1,
	qValues: [],

  //threshold:
	thresholdRange: [0.0, 1.0],
	thresholdCurrent: 0.3,
	thresholdStep: 0.1,

	//the view mode [similarity/seasonal/clustering]
	viewMode: InsightConstants.VIEW_MODE_SIMILARITY,
	sizing: {},

	//result
	result: [],

	//icon modes
	datasetIconMode: InsightConstants.ICON_DATASET_INIT_NULL,

	//may not use:
	controlPanelVisible: true,
	distanceList: [],
	distanceCurrentIndex: 0
};

var requestID = {
	fromDataset: 0,
	findMatch: 0,
	datasetInit: 0
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

		var h = Math.max( body.scrollHeight, body.offsetHeight,
		                       html.clientHeight, html.scrollHeight, html.offsetHeight );
	  var w = Math.max( body.scrollWidth, body.offsetWidth,
		                       html.clientWidth, html.scrollWidth, html.offsetWidth );

		var controlPanelWidth = data.controlPanelVisible ? 275 : 5;//we will change this later when
		 	      //we can resize this etc
		var bannerHeight = 127; //hard code for now, get it later.

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
	 * @return {boolean} - if app should render the control panel
	 */
	getControlPanelVisible: function() {
		return data.controlPanelVisible;
	},

	/**
	 * @return {Object} - return the list of datasets [{string, boolean}], name, preprocessed
	 */
	getDSCollectionList: function() {
		return data.dsCollectionList;
	},

	/**
	 * @return {Number} - the index of the current dataset
	 */
	getDSCollectionIndex: function() {
		return data.dsCollectionIndex;
	},

	/**
	 * @return {Object} - the length of the dataset for how many different queries are possible
	 */
	getDSCurrentLength: function() {
		return data.dsCurrentLength;
	},

	/**
	 * @return {Object} - the values of the current query
	 */
	getQValues: function() {
		return data.qValues;
	},

	/**
	 * @return {int} - the index of the query (of the ds)
	 * [NOTE: we'll have to define this clearly once we start creating queries]
	 * perhaps files will be ds,
	 * add custom will be another ds
	 */
	getQSeq: function() {
		return data.qSeq;
	},

	getQStart: function() {
		return data.qStart;
	},

	getQEnd: function() {
		return data.qEnd;
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
	 * @return {Object} - the current answer
	 */
	getResult: function() {
		return data.result;
	},

	/**
	 * @return {InsightConstant} - the current icon mode
	 */
	getDatasetIconMode: function() {
		return data.datasetIconMode;
	},

	/**
	 * @param {Int} - list of DS
	 */
	setDSCollectionList: function(dsCollectionList) {
		data.dsCollectionList = dsCollectionList;
	},

	/**
	 * @param {Int} - the index of the ds (file order)
	 */
	setDSCollectionIndex: function(dsCollectionIndex) {
		data.dsCollectionIndex = dsCollectionIndex;
		//TODO: consider this choice:
		data.qIndex = null;
	},

	/**
	 * @param {Int} - the current length of the DS
	 */
	setDSCurrentLength: function(dsCurrentLength) {
		data.dsCurrentLength = dsCurrentLength;
	},

	/**
	 * @param {Int} - NOTE: currently unused
	 * \ consider this in light of the single index
	 */
	setQIndex: function(qIndex) {
		data.qIndex = qIndex;
	},

	/**
	 * @param {Int} - the index of the query in the LIST IT BELONGS TO
	 */
	setQSeq: function(qSeq) {
		data.qSeq = qSeq;
		//TODO: consider what values to set
	},

	/**
	 * @param {Int} - the ending index of a query
	 */
	setQStart: function(qStart) {
		if (qStart >= data.qEnd) return;
		data.qStart = qStart;
	},

	/**
	 * @param {Int} - the ending index of a query
	 */
	setQEnd: function(qEnd) {
		if (qEnd <= data.qStart) return;
		data.qEnd = qEnd;
	},

	/**
	 * @param {Object} - the values of the current query
	 */
	setQValues: function(qValues) {
		data.qValues = qValues;
		data.qStart = 0;
		data.qEnd = qValues.length > 0 ? qValues.length - 1 : 0;
	},

	/**
	 * clears the values of the current query
	 */
	clearQuery: function() {
		this.setQValues([]);
	},

	/**
	 * @param {InsightConstant} - the view mode to switch to
	 */
	setViewMode: function(mode) {
		if (data.viewMode != mode) {
			data.viewMode = mode;
		}
	},

	/**
	 * @param {Number} - the new current threshold
	 */
	setThresholdCurrent: function(v) {
		data.thresholdCurrent = v;
	},

	/**
	 * @param {Number} - the new result (answer)
	 */
	setResult: function(r) {
		data.result = r;
	},

	/**
	 * sets the result to be empty
	 */
	clearResult: function(r) {
		this.setResult([]);
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
				var endlist = [];
				for (var i = 0; i < response.datasets.length; i++) {
					//format for dropdown
					endlist.push({value: i, label: response.datasets[i]}); // ex: [{value: 0, label: "Italy Power"}... ]
				}
				data.dsCollectionList = endlist; //doing this so datasets can be labeled

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
	requestDatasetInit: function() {
		if ((data.dsCollectionIndex == null) || (data.thresholdCurrent == null) ){
			InsightStore.setDatasetIconMode(InsightConstants.ICON_DATASET_INIT_NULL);
			InsightStore.emitChange();
			console.log("index null, no need to req");
			return;
		}

		requestID.datasetInit += 1;

		$.ajax({
			url: '/dataset/init',
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
				InsightStore.setQSeq(0);//set off event seq to default query
				InsightStore.requestQueryFromDataset();
			},
			error: function(xhr) {
				//TODO: later on, pop up a red message top-right corner that something failed
				console.log("error requesting dataset init");
			}
		});
	},

	/**
	 * requests server for a query within the dataset
	 */
	requestQueryFromDataset: function() {
		if ((data.dsCollectionIndex == null) || (data.qSeq == null) ||
	 			(data.dsCollectionIndex < 0) || (data.qSeq < 0)){
			console.log("dsCollectionIndex or qseq null, no need to req");
			return;
		}

		requestID.fromDataset += 1;

		$.ajax({
			url: '/query/fromdataset',
			data: {
				dsIndex : data.dsCollectionIndex, //the index of the ds in memory on the server
				qSeq : data.qSeq, //the index of the query in the list
				requestID : requestID.fromDataset
			},
			dataType: 'json',
			success: function(response) {
			  	if (response.requestID != requestID.fromDataset) {
						//its not smooth if you run on your own comp, but definitely need it
						//if someone else is using this. ill add another loading thing to make it more clear
						return;
			    }
			    var endlist = [];
			    for (var i = 0; i < response.query.length; i++) {
						endlist.push({index: i, value: response.query[i]}); // ex: [{value: 0, label: "Italy Power"}... ]
			    }
					InsightStore.setQValues(endlist);
			  	InsightStore.setResult([]);
			    InsightStore.emitChange();
			},
			error: function(xhr) {
				//TODO: later on, pop up a red message top-right corner that something failed
				console.log("error in requesting query values");
			}
		});
	},

	/**
	 * requests server to find the answer
	 */
	requestFindMatch: function() {

		if ((data.dsCollectionIndex == null) || (data.qSeq == null) ||
				(data.dsCollectionIndex < 0) || (data.qSeq < 0)){
			console.log("dsCollectionIndex or qseq null, no need to req");
			return;
		}

		if ((data.qStart == null) || (data.qEnd == null) ||
				(data.qStart < 0) || (data.qEnd < 0) ||
			  (data.qStart >= data.qEnd) || (data.qEnd > data.qValues.length)){
			console.log("setting defaults for qStart and end ");

			 data.qStart = 0;
			 data.qEnd = data.qValues.length - 1;
		}

		requestID.findMatch += 1;

		$.ajax({
			url: '/query/find',
			data: {
			    dsIndex: data.dsCollectionIndex, //the index of the ds in memory on the server we querying
			    qIndex: data.dsCollectionIndex, //the index of from which the qIndex belongs
			    qSeq: data.qSeq, //the index of q in its ds
			    qStart: data.qStart,
			    qEnd: data.qEnd,
			    requestID: requestID.findMatch
			},
			dataType: 'json',
			success: function(response) {
			    if (response.requestID != requestID.findMatch){
						console.log(response, requestID);
						return;
			    }
					var endlist = [];
			    for (var i = 0; i < response.result.length; i++) {
						endlist.push({index: (i + data.qStart), value: response.result[i]}); // ex: [{value: 0, label: "Italy Power"}... ]
			    }
			    data.result = endlist;
			    InsightStore.emitChange();
			},
			error: function(xhr) {
				//TODO: later on, pop up a red message top-right corner that something failed
				console.log("error in finding answer");
			}
		});
	},



//~~~~~~~~~~~~~~~~~~~~~~~~~~~  NOTE: not currently used ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

	/**
	 * @return {Object} - the list of the distance |
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
	 * @param {boolean} value - if app should render the control panel
	 */
	setControlPanelVisible: function(value) {
		data.controlPanelVisible = value;
	},

	/**
	 * @param {Number} - the new index of the current index
	 */
	setDistanceCurrentIndex: function(v) {
		data.queryCurrentIndex = v;
	}
});

// Register callback to handle all updates
AppDispatcher.register(function(action) {

	switch(action.actionType) {
		case InsightConstants.RESIZE_APP:
			InsightStore.calculateDimensions()
			InsightStore.emitChange();
			break;
		case InsightConstants.FIND_MATCH:
			InsightStore.requestFindMatch();
			break;
		case InsightConstants.CONTROL_PANEL_VISIBLE:
			//if(InsightStore.emitChange();
			break;
		case InsightConstants.REQUEST_DATA_INIT:
			InsightStore.setDatasetIconMode(InsightConstants.ICON_DATASET_INIT_LOADING);
			InsightStore.emitChange();
			InsightStore.requestDatasetInit();//we should add in a loading icon
			break;
		case InsightConstants.SELECT_DS_INDEX:
			InsightStore.setDSCollectionIndex(action.id);
			InsightStore.clearQuery();
			InsightStore.clearResult();
			InsightStore.emitChange();//we want the list to update
			break;
		case InsightConstants.SELECT_QUERY:
			InsightStore.setQSeq(action.id)
			InsightStore.clearResult();
			InsightStore.requestQueryFromDataset();
			break;
		case InsightConstants.SELECT_DISTANCE:
			break;
		case InsightConstants.SELECT_THRESHOLD:
			InsightStore.setThresholdCurrent(action.id);
			InsightStore.emitChange();
			break;
		case InsightConstants.SELECT_END_Q:
			InsightStore.setQEnd(action.id);
			InsightStore.clearResult();
			InsightStore.emitChange();
			break;
		case InsightConstants.SELECT_START_Q:
			InsightStore.setQStart(action.id);
			InsightStore.clearResult();
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
