var React = require('react');
var InsightActions = require('./../../flux/actions/InsightActions');
var InsightButton = require('./../InsightButton');

var resizeId;

/**
 * This dropdown will have all the datasets
 */
var InsightSelectRangeButton = React.createClass({
   render: function() {
     return this.props.show &&
     <div className="options">
      <InsightButton text="Select Current Range" onClick={this._eventListenerClick} />
     </div>;
   },
   _eventListenerClick: function(){
    clearTimeout(resizeId);
    resizeId = setTimeout(this._handleClickAction, 100);
   },
   _handleClickAction: function( e ) {
     InsightActions.selectCurrentRange();
   }
});

module.exports = InsightSelectRangeButton;
