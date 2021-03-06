var React = require('react');
var InsightActions = require('./../flux/actions/InsightActions');
var AnnotatedSlider = require('./AnnotatedSlider');

/**
 * This dropdown will have all the datasets
 */
var InsightThresholdSlider = React.createClass({
   render: function() {
     var divStyle = {width: this.props.width};

     var panelJSX =
     <div className = "panel">
        <h4> Similarity Threshold </h4>
        <div className="options">
          <AnnotatedSlider
            max={this.props.thresholdRange[1]}
            min={this.props.thresholdRange[0]}
            step={this.props.thresholdStep}
            value={this.props.thresholdCurrent}
            onChange={this._eventListenerThreshold} />
        </div>
     </div>;

     return <div> {panelJSX} </div>;
   },
   _eventListenerThreshold: function(e){
    clearTimeout(this._resizeId);
    this._resizeId = setTimeout(this._handleThresholdChange(e), 100);
   },
   _handleThresholdChange: function( e ) {
     InsightActions.selectThreshold(e.target.value);
   }

});

module.exports = InsightThresholdSlider;
