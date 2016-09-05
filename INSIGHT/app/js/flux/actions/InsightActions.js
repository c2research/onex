var AppDispatcher = require('./../dispatcher/AppDispatcher');
var InsightConstants = require('./../constants/InsightConstants');

var InsightActions = {
  /**
   * @param  {number} index
   * exampe function
   */
  displayTimeSeries: function(index) {
	  AppDispatcher.dispatch({
		  actionType: InsightConstants.DISPLAY_TS,
		  id: index
	  });
  },
  /**
   * calls to resize the app
   */
  resizeApp: function() {
	  AppDispatcher.dispatch({
		  actionType: InsightConstants.RESIZE_APP,
		  id: 1
	  });
  }
};

module.exports = InsightActions;
