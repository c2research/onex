var React = require('react');
var InsightActions = require('./../flux/actions/InsightActions');
var InsightButton = require('./InsightButton');

var resizeId;

/**
 * This dropdown will have all the datasets
 */
var InsightFind = React.createClass({
   render: function() {
     return this.props.show ?
     <div className="options">
      <InsightButton text="Find Match" onClick={this._eventListenerClick} />
     </div>: null;
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
