var React = require('react');
var InsightActions = require('./../flux/actions/InsightActions');
var InsightConstants = require('./../flux/constants/InsightConstants');

var resizeId;

/**
 * This is for the start and end
 * TODO: implement
 */
var InsightQueryOptions = React.createClass({
   render: function() {
     var rangeSliderJSX = this.props.dsCurrentLength != null && this.props.dsCurrentLength > 0 ?
     <div>Start and End</div> : null;

     //a slider with two dots, one green one red
     //start and end
     return rangeSliderJSX;
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
     InsightActions.setStartQ(e.target.value);
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
     InsightActions.setEndQ(e.target.value);
   }
});

module.exports = InsightQueryOptions;
