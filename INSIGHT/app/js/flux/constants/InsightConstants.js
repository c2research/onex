var keyMirror = require('keymirror');

var InsightConstants = keyMirror({
	RESIZE_APP: null,
	CONTROL_PANEL_VISIBLE: null,
	SELECT_DS_INDEX: null,
	SELECT_DISTANCE: null,
	SELECT_THRESHOLD: null,
	REQUEST_DATA_INIT: null,
	ICON_DATASET_INIT_LOADING: null,
	ICON_DATASET_INIT_LOADED: null,
	ICON_DATASET_INIT_NULL: null,

	SEND_MESSAGE: null,

	VIEW_MODE_SIMILARITY: null,
	VIEW_MODE_SEASONAL: null,
	VIEW_MODE_CLUSTER: null,

	FIND_MATCH: null,
	SIMILARITY_SELECT_QUERY: null,
	SIMILARITY_LOAD_QUERY: null,
	SIMILARITY_SELECT_START_Q: null,
	SIMILARITY_SELECT_END_Q: null,
	UPLOAD_QUERY_FILE: null,
	QUERY_TYPE_DATASET: null,
	QUERY_TYPE_UPLOAD: null,

	GRAPH_TYPE_LINE: null,
	GRAPH_TYPE_HORIZON: null,
	GRAPH_TYPE_CONNECTED: null,
	GRAPH_TYPE_ERROR: null,
	GRAPH_TYPE_WARP: null,
	SELECT_DTW_BIAS: null,

	SEASONAL_SELECT_QUERY: null,
	SEASONAL_LOAD_QUERY: null,
	SEASONAL_SELECT_LENGTH: null,
	SEASONAL_SELECT_PATTERN_INDEX: null,
	SEASONAL_REQUEST: null,
});

module.exports = InsightConstants;
