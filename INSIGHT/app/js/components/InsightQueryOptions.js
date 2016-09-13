var React = require('react');
var InsightActions = require('./../flux/actions/InsightActions');
var InsightConstants = require('./../flux/constants/InsightConstants');

var resizeId;

/**
 * This is for the start and end
 */
var InsightQueryOptions = React.createClass({
   render: function() {
     var range = this.props.dsCurrentLength;
     //a slider with two dots, one green one red
     //start and end

     return <div>Start and End</div>
   },
   _eventListenerStart: function(e){
    clearTimeout(resizeId);
    resizeId = setTimeout(this._onResizeStartAction(e), 100);
   },
   /**
    * user stopped changing stuff, fire event!
    */
   _onResizeStartAction: function(e){
     var data = 5; //TODO: get the data
     InsightActions.setStartQ();
   },
   _eventListenerEnd: function(e){
    clearTimeout(resizeId);
    resizeId = setTimeout(this._onResizeEndAction(e), 100);
   },
   /**
    * user stopped changing stuff, fire event!
    */
   _onResizeEndAction: function(e){
     var data = 5; //TODO: get the data
     InsightActions.setEndQ();
   }
});

module.exports = InsightQueryOptions;
