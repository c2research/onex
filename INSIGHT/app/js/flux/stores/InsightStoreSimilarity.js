var AppDispatcher = require('./../dispatcher/AppDispatcher');
var InsightStore = require('./InsightStore');
var InsightConstants = require('./../constants/InsightConstants');
var assign = require('object-assign');
var $ = require('jquery');

var CHANGE_EVENT = 'change';

var data = {

	//state
	graphType: InsightConstants.GRAPH_TYPE_WARP,
	datasetViewRange: [],
	uploadViewRange: [],

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
	findMatch: 0,
	uploadQuery: 0
}

var InsightStoreSimilarity = assign({}, {
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

	getGraphType: function() {
		return data.graphType;
	},

	getViewRange: function() {
		if (similarityQueryInfo.qTypeLocal == InsightConstants.QUERY_TYPE_DATASET){
			return data.datasetViewRange;
		}	else if (similarityQueryInfo.qTypeLocal == InsightConstants.QUERY_TYPE_UPLOAD)  {
			return data.uploadViewRange;
		}
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
		if (qStart >= similarityQueryInfo.qUploadEnd) return;
		similarityQueryInfo.qUploadStart = qStart;
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
		similarityQueryInfo.qUploadStart = 0;
		similarityQueryInfo.qUploadEnd = qValues.length > 0 ? qValues.length - 1 : 0;

		data.uploadViewRange = [similarityQueryInfo.qDatasetStart, similarityQueryInfo.qDatasetEnd];
	},

	/**
	 * @param {Object} - the values of the current query
	 */
	setQDatasetValues: function(qValues) {
		similarityQueryInfo.qDatasetValues = qValues;
		similarityQueryInfo.qDatasetStart = 0;
		similarityQueryInfo.qDatasetEnd = qValues.length > 0 ? qValues.length - 1 : 0;

		data.datasetViewRange = [similarityQueryInfo.qDatasetStart, similarityQueryInfo.qDatasetEnd];
	},

	/**
	 * sets the dtw bias
	 * @param {Number} - the value to be set to
	 */
	setDTWBias: function(value) {
		data.dtwBias = value;
	},

	/**
	 * @param {InsightConstants} - the graph type to be set
	 */
	setGraphType: function(type) {
		data.graphType = type;
	},

	setViewRange: function(array) {
		if (similarityQueryInfo.qTypeLocal == InsightConstants.QUERY_TYPE_DATASET){
			data.datasetViewRange = array;
		}	else if (similarityQueryInfo.qTypeLocal == InsightConstants.QUERY_TYPE_UPLOAD)  {
			data.uploadViewRange = array;
		}
	},

	/**
	 * current view is selected for the query start and end
	 */
	selectCurrentRange: function() {
		if (similarityQueryInfo.qTypeLocal == InsightConstants.QUERY_TYPE_DATASET){
			this.setQDatasetStart(data.datasetViewRange[0]);
			this.setQDatasetEnd(data.datasetViewRange[1]);
		}	else if (similarityQueryInfo.qTypeLocal == InsightConstants.QUERY_TYPE_UPLOAD)  {
			this.setQUploadStart(data.datasetViewRange[0]);
			this.setQUploadEnd(data.uploadViewRange[1]);
		}
	},
	/**
	 * gets the dtw bias
	 */
	getDTWBias: function() {
		return data.dtwBias;
	},

	requestQueryFromDataset: function() {
		InsightStore.requestSequenceFromDataset(similarityQueryInfo.qDatasetSeq,
			function(endlist) {
		   	InsightStoreSimilarity.setQDatasetValues(endlist);
				InsightStore.calculateDimensions();
		    InsightStore.emitChange();
		   }
		);
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

				InsightStoreSimilarity.setQUploadValues(endlist);
				InsightStore.emitChange();
			},
			error: function(xhr) {
				//TODO: later on, pop up a red message top-right corner that something failed
				console.log("error in uploading query");
			}
		});
	},

	/**
	 * requests server to find the answer
	 */
	requestFindMatch: function() {
		var qStart, qEnd, qSeq, qTypeLocal, qValues, qType;

		//NOTE: we have the option of moving the values in similarityQueryInfo into upload
		// and dataset and then we can decompose the values more neatly.
		var qTypeLocal = similarityQueryInfo.qTypeLocal;
		if (qTypeLocal == InsightConstants.QUERY_TYPE_DATASET){
			qStart = similarityQueryInfo.qDatasetStart;
			qEnd = similarityQueryInfo.qDatasetEnd;
			qSeq = similarityQueryInfo.qDatasetSeq;
			qValues = similarityQueryInfo.qDatasetValues;
			qType = 0;
		} else {
			qStart = similarityQueryInfo.qUploadStart;
			qEnd = similarityQueryInfo.qUploadEnd;
			qSeq = similarityQueryInfo.qUploadSeq;
			qValues = similarityQueryInfo.qUploadValues;
			qType = 1;
		}

		var dsCollectionIndex = InsightStore.getDSCollectionIndex();

		if ((dsCollectionIndex == null) || (qSeq == null) ||
				(dsCollectionIndex < 0) || (qSeq < 0)){
			console.log("dsCollectionIndex or qseq null, no need to req", qSeq, dsCollectionIndex);
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
			    dsCollectionIndex: dsCollectionIndex, //the index of the ds in memory on the server we querying
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
				qDsCollectionIndex: dsCollectionIndex
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
					InsightStoreSimilarity.addQueryResultPair(result);//response.result.warpingPath,
				  InsightStore.emitChange();
			},
			error: function(xhr) {
				//TODO: later on, pop up a red message top-right corner that something failed
				console.log("error in finding answer");
			}
		});
	},


});

// Register callback to handle all updates
AppDispatcher.register(function(action) {
	switch(action.actionType) {
		case InsightConstants.REQUEST_DATA_INIT:
			InsightStoreSimilarity.clearLiveView();
			if (InsightStore.getViewMode() == InsightConstants.VIEW_MODE_SIMILARITY) {
				InsightStore.requestDatasetInit(function() {
					InsightStoreSimilarity.setQDatasetSeq(0);
					InsightStoreSimilarity.requestQueryFromDataset();
				});
			}
			break;
		case InsightConstants.FIND_MATCH:
			InsightStoreSimilarity.requestFindMatch();
			break;
		case InsightConstants.SIMILARITY_SELECT_QUERY:
			InsightStoreSimilarity.clearLiveView();
			if (similarityQueryInfo.qTypeLocal == InsightConstants.QUERY_TYPE_DATASET) {
				InsightStoreSimilarity.setQDatasetSeq(action.id)
			}	else if (similarityQueryInfo.qTypeLocal == InsightConstants.QUERY_TYPE_UPLOAD) {
				InsightStoreSimilarity.setQUploadSeq(action.id)
			}
			InsightStore.emitChange();
			break;
		case InsightConstants.SIMILARITY_LOAD_QUERY:
			InsightStoreSimilarity.requestQueryFromDataset();
			break;
		case InsightConstants.SIMILARITY_SELECT_END_Q:
			InsightStoreSimilarity.clearLiveView();
			if (similarityQueryInfo.qTypeLocal == InsightConstants.QUERY_TYPE_DATASET){
				InsightStoreSimilarity.setQDatasetEnd(action.id);
			}	else if (similarityQueryInfo.qTypeLocal == InsightConstants.QUERY_TYPE_UPLOAD)  {
				InsightStoreSimilarity.setQUploadEnd(action.id)
			}
			InsightStore.emitChange();
			break;
		case InsightConstants.SIMILARITY_SELECT_START_Q:
			InsightStoreSimilarity.clearLiveView();
			if (similarityQueryInfo.qTypeLocal == InsightConstants.QUERY_TYPE_DATASET){
				InsightStoreSimilarity.setQDatasetStart(action.id);
			}	else if (similarityQueryInfo.qTypeLocal == InsightConstants.QUERY_TYPE_UPLOAD) {
				InsightStoreSimilarity.setQUploadStart(action.id)
			}
			InsightStore.emitChange();
			break;
		case InsightConstants.QUERY_TYPE_UPLOAD:
			InsightStoreSimilarity.clearLiveView();
			InsightStoreSimilarity.setQueryType(action.actionType);
			InsightStore.emitChange();
			break;
		case InsightConstants.QUERY_TYPE_DATASET:
			InsightStoreSimilarity.clearLiveView();
			InsightStoreSimilarity.setQueryType(action.actionType);
			InsightStore.emitChange();
			break;
		case InsightConstants.UPLOAD_QUERY_FILE:
			InsightStoreSimilarity.clearLiveView();
			InsightStoreSimilarity.requestUploadQuery(action.id);
			break;
		case InsightConstants.SELECT_DTW_BIAS:
			InsightStoreSimilarity.setDTWBias(action.id);
			InsightStore.emitChange();
			break;
		case InsightConstants.GRAPH_TYPE_LINE:
			InsightStoreSimilarity.setGraphType(action.actionType);
			InsightStore.emitChange();
			break;
		case InsightConstants.GRAPH_TYPE_HORIZON:
			InsightStoreSimilarity.setGraphType(action.actionType);
			InsightStore.emitChange();
			break;
		case InsightConstants.GRAPH_TYPE_CONNECTED:
			InsightStoreSimilarity.setGraphType(action.actionType);
			InsightStore.emitChange();
			break;
		case InsightConstants.GRAPH_TYPE_ERROR:
			InsightStoreSimilarity.setGraphType(action.actionType);
			InsightStore.emitChange();
			break;
		case InsightConstants.GRAPH_TYPE_SPLIT:
			InsightStoreSimilarity.setGraphType(action.actionType);
			InsightStore.emitChange();
			break;
		case InsightConstants.GRAPH_TYPE_RADIAL:
			InsightStoreSimilarity.setGraphType(action.actionType);
			InsightStore.emitChange();
			break;
		case InsightConstants.GRAPH_TYPE_WARP:
			InsightStoreSimilarity.setGraphType(action.actionType);
			InsightStore.emitChange();
			break;
		case InsightConstants.SELECT_VIEW_POINTS:
			InsightStoreSimilarity.setViewRange(action.id);
			InsightStore.emitChange();
		case InsightConstants.SELECT_CURRENT_RANGE:
			InsightStoreSimilarity.selectCurrentRange();
			InsightStore.emitChange();
		default:
		  // no op
	}
});

module.exports = InsightStoreSimilarity;
