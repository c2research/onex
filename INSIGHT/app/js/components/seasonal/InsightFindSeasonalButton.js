var React = require('react');
var InsightActions = require('./../../flux/actions/InsightActions');
var InsightButton = require('./../InsightButton');

var clickId;

/**
 * This dropdown will have all the datasets
 */
var InsightFind = React.createClass({
   render: function() {
     return this.props.show &&
     <div className="options">
      <InsightButton text="Find Seasonal Patterns" onClick={this._eventListenerClick} />
     </div>;
   },

   _eventListenerClick: function(){
    clearTimeout(clickId);
    clickId = setTimeout(this._handleClickAction, 100);
   },
   _handleClickAction: function( e ) {
     InsightActions.findSeasonal();
   }
});

module.exports = InsightFind;
