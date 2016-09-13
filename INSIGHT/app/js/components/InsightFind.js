var React = require('react');
var InsightActions = require('./../flux/actions/InsightActions');

var resizeId;

/**
 * This dropdown will have all the datasets
 */
var InsightFind = React.createClass({
   render: function() {

     var buttonJSX =
     <div className="options">
       <div className="findButton"
            onClick={this._eventListenerClick}>Find  Match
        </div>
     </div>

     return buttonJSX;
   },
   _eventListenerClick: function(){
    clearTimeout(resizeId);
    resizeId = setTimeout(this._handleClickAction, 100);
   },
   _handleClickAction: function( e ) {
     InsightActions.findMatch();
   }

});

module.exports = InsightFind;
