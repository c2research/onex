var AppDispatcher = require('./../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var InsightConstants = require('./../constants/InsightConstants');
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

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
		return 5;
	},

	/**
	 * @return {boolean} - if app should render the control panel
	 */
	getControlPanelVisible: function() {
		return data.controlPanelVisible;
	},

	/**
	 * @param {boolean} value - if app should render the control panel
	 */
	setControlPanelVisible: function(value) {
		data.controlPanelVisible = value;
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
		default:
		  // no op
		}
});

module.exports = InsightStore;
