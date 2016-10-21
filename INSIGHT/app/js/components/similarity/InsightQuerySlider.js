var React = require('react');
var Select = require('react-select');
var InsightActions = require('./../../flux/actions/InsightActions');
var AnnotatedSlider = require('./../AnnotatedSlider');

// var resizeId;

/**
 * This dropdown will have all the datasets
 */
var InsightQuerySlider = React.createClass({
   render: function() {
     var placeholder = "choose from the dataset";


     var panelJSX = this.props.dsCurrentLength > 0 ?
     <div className="panel">
       <h4 className="options"> Select a Query From Current Dataset  </h4>
       <div className="options">
       <AnnotatedSlider
          max={this.props.dsCurrentLength - 1}
          min={0}
          step={1}
          value={this.props.qSeq}
          onChange={this._eventListenerThreshold}/>
        </div>
      </div> : null;

     return panelJSX;
   },
   _eventListenerThreshold: function(e) {
    InsightActions.selectSimilarityQuery(parseInt(e.target.value, 10));
    clearTimeout(this._resizeId);
    this._resizeId = setTimeout(this._handleQueryChange(e), 200);
   },
   _handleQueryChange: function( e ) {
     InsightActions.loadSimilarityQuery();
   }
});


module.exports = InsightQuerySlider;
