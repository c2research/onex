var keyMirror = require('keymirror');

var InsightConstants = keyMirror({
	RESIZE_APP: null,
	CONTROL_PANEL_VISIBLE: null,
	SELECT_DS_INDEX: null,
	FIND_MATCH: null,
	SELECT_QUERY: null,
	SELECT_DISTANCE: null,
	SELECT_THRESHOLD: null,
	SELECT_START_Q: null,
	SELECT_END_Q: null,
	REQUEST_DATA_INIT: null,
	VIEW_MODE_SIMILARITY: null,
	VIEW_MODE_SEASONAL: null,
	VIEW_MODE_CLUSTER: null,
	SELECT_QUERY_FROMDATASET: null,
	QUERY_TYPE_DATASET: null,
	QUERY_TYPE_UPLOAD: null,
	ICON_DATASET_INIT_LOADING: null,
	ICON_DATASET_INIT_LOADED: null,
	ICON_DATASET_INIT_NULL: null
});

module.exports = InsightConstants;
