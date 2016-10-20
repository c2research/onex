var AppDispatcher = require('./../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var InsightStore = require('./InsightStore');
var InsightConstants = require('./../constants/InsightConstants');
var assign = require('object-assign');
var $ = require('jquery');

var CHANGE_EVENT = 'change';

// TODO: how about moving these objects into the Store object?
var data = {

	//state
	graphType: InsightConstants.GRAPH_TYPE_LINE,

	//dtw bias
	dtwBias: 0
};

var similarityQueryInfo = {
		qTypeAPI: 0, //use this later for q from diff sets
		qUploadSeq: 0,//index of the query
		qDatasetSeq: 0,//index of the query
		qDatasetStart: 0,
		qDatasetEnd: -1,
		qUploadStart: 0,
		qUploadEnd: -1,
		qDatasetValues: [],
		qUploadValues: [],
	 	qTypeLocal: InsightConstants.QUERY_TYPE_DATASET
}
/*
 * This will hold all the data on results and formed queries
 * this can go into another Store eventaully
 */
var results = {
	viewLiveIndices: [],
	resultList: []
}

/*
 * A counter for requestIDs to ensure last query is ultimately
 * used.
 */
var requestID = {
	fromDataset: 0,
	findMatch: 0,
	uploadQuery: 0
}

var InsightSimilarityStore = assign({}, EventEmitter.prototype, {
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

	/*
	 * Called upon the success a query
	 */
	addQueryResultPair: function(result) {
		results.viewLiveIndices=[0];
		results.resultList.unshift(result);
	},

	/*
	 * clears the list of view live indices, called on change in control panel
	 * in order to show new query in full.
	 * view live indices are set when a new
 	 * result is found and when a query/result match is selected in the data table (future)
	 */
	clearLiveView: function() {
		results.viewLiveIndices = [];
	},

	/*
	 * @return {Object} - returns all the result information
	 */
	getResults: function() {
		return results;
	},

	/**
	 * @return {Object} - the values of the current query (uploaded)
	 */
	getQUploadValues: function() {
		return similarityQueryInfo.qUploadValues;
	},

	/**
	 * @return {Object} - the values of the current query (dataset)
	 */
	getQDatasetValues: function() {
		return similarityQueryInfo.qDatasetValues;
	},

	getSimilarityQueryInfo: function() {
		return similarityQueryInfo;
	},

	/**
	 * @param {InsightConstant} - the current query type
	 */
	setQueryType: function(v) {
		similarityQueryInfo.qTypeLocal = v;
	},

	/**
	 * @param {Int} - the index of the query in the LIST IT BELONGS TO
	 */
	setQUploadSeq: function(qSeq) {
		similarityQueryInfo.qUploadSeq = qSeq;
	},

	/**
	 * @param {Int} - the index of the query in the LIST IT BELONGS TO
	 */
	setQDatasetSeq: function(qSeq) {
		similarityQueryInfo.qDatasetSeq = qSeq;
	},

	/**
	 * @param {Int} - the ending index of a query
	 */
	setQDatasetStart: function(qStart) {
		if (qStart >= similarityQueryInfo.qDatasetEnd) return;
		similarityQueryInfo.qDatasetStart = qStart;
	},

	/**
	 * @param {Int} - the ending index of a query
	 */
	setQDatasetEnd: function(qEnd) {
		if (qEnd <= similarityQueryInfo.qDatasetStart) return;
		similarityQueryInfo.qDatasetEnd = qEnd;
	},

	/**
	 * @param {Int} - the ending index of a query
	 */
	setQUploadStart: function(qStart) {
		if (qStart >= similarityQueryInfo.qEnd) return;
		similarityQueryInfo.qStart = qStart;
	},

	/**
	 * @param {Int} - the ending index of a query
	 */
	setQUploadEnd: function(qEnd) {
		if (qEnd <= similarityQueryInfo.qUploadStart) return;
		similarityQueryInfo.qUploadEnd = qEnd;
	},

	/**
	 * @param {Object} - the values of the current query
	 */
	setQUploadValues: function(qValues) {
		similarityQueryInfo.qUploadValues = qValues;
		similarityQueryInfo.qDatasetStart = 0;
		similarityQueryInfo.qDatasetEnd = qValues.length > 0 ? qValues.length - 1 : 0;
	},

	/**
	 * @param {Object} - the values of the current query
	 */
	setQDatasetValues: function(qValues) {
		similarityQueryInfo.qDatasetValues = qValues;
		similarityQueryInfo.qDatasetStart = 0;
		similarityQueryInfo.qDatasetEnd = qValues.length > 0 ? qValues.length - 1 : 0;
	},

	/**
	 * sets the dtw bias
	 * @param {Number} - the value to be set to
	 */
	setDTWBias: function(value) {
		data.dtwBias = value;
	},
	/**
	 * gets the dtw bias
	 */
	getDTWBias: function() {
		return data.dtwBias;
	},

	/**
	 * requests server for a query within the dataset
	 */
	requestQueryFromDataset: function() {

		if ((InsightStore.getDSCollectionIndex() == null) || (similarityQueryInfo.qDatasetSeq == null) ||
	 			(InsightStore.getDSCollectionIndex() < 0) || (similarityQueryInfo.qDatasetSeq < 0)){
			console.log("dsCollectionIndex or qseq null, no need to req");
			return;
		}

		requestID.fromDataset += 1;

		$.ajax({
			url: '/query/fromdataset/',
			data: {
				dsCollectionIndex : data.dsCollectionIndex, //the index of the ds in memory on the server
				qSeq : data.similarityQueryInfo.qDatasetSeq, //the index of the query in the list
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
			   	InsightSimilarityStore.setQDatasetValues(endlist);
					InsightStore.calculateDimensions();//TODO: remove this. increasing content, adds slider, increases													 //size of control panel, things need to be resized.
			    InsightSimilarityStore.emitChange();
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
		var qStart, qEnd, qSeq, qTypeLocal, qType;

		//NOTE: we have the option of moving the values in similarityQueryInfo into upload
		// and dataset and then we can decompose the values more neatly.
		var qTypeLocal = similarityQueryInfo.qTypeLocal;
		if (qTypeLocal == InsightConstants.QUERY_TYPE_DATASET){
			qStart = similarityQueryInfo.qDatasetStart;
			qEnd = similarityQueryInfo.qDatasetEnd;
			qSeq = similarityQueryInfo.qDatasetSeq;
			qType = 0;
		} else {
			qStart = similarityQueryInfo.qUploadStart;
			qEnd = similarityQueryInfo.qUploadEnd;
			qSeq = similarityQueryInfo.qUploadSeq;
			qType = 1;
		}

		if ((InsightStore.getDSCollectionIndex() == null) || (qSeq == null) ||
				(InsightStore.getDSCollectionIndex() < 0) || (qSeq < 0)){
			console.log("dsCollectionIndex or qseq null, no need to req", qSeq, InsightStore.getDSCollectionIndex());
			return;
		}

		if ((qStart == null) || (qEnd == null) ||
				(qStart < 0) || (qEnd < 0) ||
			  (qStart >= qEnd) || (qEnd > qValues.length)){
			console.log("setting defaults for qStart and end ");

			 qStart = 0;
			 qEnd = qValues.length - 1;
		}

		requestID.findMatch += 1;

		$.ajax({
			url: '/query/find/',
			data: {
			    dsCollectionIndex: InsightStore.getDSCollectionIndex(), //the index of the ds in memory on the server we querying
			    qType: qType, //the type of query, 0->dataset, 1->from file
			    qSeq: qSeq, //the index of q in its ds
			    qStart: qStart,
			    qEnd: qEnd,
			    requestID: requestID.findMatch
			},
			dataType: 'json',
			currentState: {
				qTypeLocal: qTypeLocal,
				qSeq: qSeq,
				qStart: qStart,
				qEnd: qEnd,
				qValues: qValues,
				threshold: InsightStore.getThresholdCurrent(),
				qDsCollectionIndex: InsightStore.getDSCollectionIndex()
			},
			success: function(response) {
			    if (response.requestID != requestID.findMatch){
						console.log(response, requestID);
						return;
			    }

					var currentState = this.currentState;

					var endlist = response.result.map(function(val, i) {
						return [i + currentState.qStart, val];
					});

			    var result = { //structure of query result pair
						qTypeLocal: currentState.qTypeLocal,
						qSeq: currentState.qSeq,
						qStart: currentState.qStart,
						qEnd: currentState.qEnd,
						qValues: currentState.qValues,
						qThreshold: currentState.threshold,
						qDistanceType: null,
						qDsCollectionIndex: currentState.qDsCollectionIndex,
						rSeq: response.seq,
						rStart: response.start,
						rEnd: response.end,
						rValues: endlist,
						dsName: response.dsName,
						warpingPath: response.warpingPath,
						similarityValue: response.dist
					}
					InsightSimilarityStore.addQueryResultPair(result);//response.result.warpingPath,
				  InsightSimilarityStore.emitChange();
			},
			error: function(xhr) {
				//TODO: later on, pop up a red message top-right corner that something failed
				console.log("error in finding answer");
			}
		});
	},

	/**
	 * requests server upload a file
	 */
	requestUploadQuery: function(files) {
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
			//dataType: 'json',
			success: function(response) {
					var endlist = response.query.map(function(val, i) {
						return [i, val];
					});

			    InsightSimilarityStore.setQUploadValues(endlist);
			    InsightSimilarityStore.emitChange();
			},
			error: function(xhr) {
				//TODO: later on, pop up a red message top-right corner that something failed
				console.log("error in uploading query");
			}
		});
	},
});

// Register callback to handle all updates
AppDispatcher.register(function(action) {
	switch(action.actionType) {
		case InsightConstants.FIND_MATCH:
			InsightSimilarityStore.requestFindMatch();
			break;
		case InsightConstants.SELECT_QUERY:
			InsightSimilarityStore.clearLiveView();
			if (similarityQueryInfo.qTypeLocal == InsightConstants.QUERY_TYPE_DATASET){
				InsightSimilarityStore.setQDatasetSeq(action.id)
			}	else {
				InsightSimilarityStore.setQUploadSeq(action.id)
			}
			InsightSimilarityStore.emitChange();
			break;
		case InsightConstants.LOAD_QUERY:
			InsightSimilarityStore.requestQueryFromDataset();
			break;
		case InsightConstants.SELECT_END_Q:
			InsightSimilarityStore.clearLiveView();
			if (similarityQueryInfo.qTypeLocal == InsightConstants.QUERY_TYPE_DATASET){
				InsightSimilarityStore.setQDatasetEnd(action.id);
			}	else {
				InsightSimilarityStore.setQUploadEnd(action.id)
			}
			InsightSimilarityStore.emitChange();
			break;
		case InsightConstants.SELECT_START_Q:
			InsightSimilarityStore.clearLiveView();
			if (similarityQueryInfo.qTypeLocal == InsightConstants.QUERY_TYPE_DATASET){
				InsightSimilarityStore.setQDatasetStart(action.id);
			}	else {
				InsightSimilarityStore.setQUploadStart(action.id)
			}
			InsightSimilarityStore.emitChange();
			break;
		case InsightConstants.QUERY_TYPE_UPLOAD:
			InsightSimilarityStore.clearLiveView();
			InsightSimilarityStore.setQueryType(action.actionType);
			InsightSimilarityStore.emitChange();
			break;
		case InsightConstants.QUERY_TYPE_DATASET:
			InsightSimilarityStore.clearLiveView();
			InsightSimilarityStore.setQueryType(action.actionType);
			InsightSimilarityStore.emitChange();
			break;
		case InsightConstants.UPLOAD_QUERY_FILE:
			InsightSimilarityStore.clearLiveView();
			InsightSimilarityStore.requestUploadQuery(action.id);
			break;
		case InsightConstants.SELECT_DTW_BIAS:
			InsightSimilarityStore.setDTWBias(action.id);
			InsightSimilarityStore.emitChange();
		default:
		  // no op
	}
});

module.exports = InsightSimilarityStore;
