var React = require('react');
var InsightActions = require('./../flux/actions/InsightActions');

var resizeId;

/**
 * This dropdown will have all the datasets
 */
var InsightThresholdSlider = React.createClass({
   render: function() {
     var divStyle = {width: this.props.width};

     var thresholdRange = this.props.thresholdRange;
     var thresholdCurrent = this.props.thresholdCurrent;
     var thresholdStep = this.props.thresholdStep;

/*
<InputRange
  maxValue={this.props.thresholdRange[1]}
  minValue={this.props.thresholdRange[0]}
  step={this.props.thresholdStep}
  value={this.props.thresholdCurrent}
  onChange={this._eventListenerThreshold}
/>
*/

     var panelJSX =
     <div className="section sliderDiv">
        <h2> Threshold </h2>
        <input
           id="slider1"
           type="range"
           width="140px"
           max={this.props.thresholdRange[1]}
           min={this.props.thresholdRange[0]}
           step={this.props.thresholdStep}
           value={this.props.thresholdCurrent}
           onChange={this._eventListenerThreshold} />
         <output id="range1">{this.props.thresholdCurrent}</output>
     </div>;

     return <div> {panelJSX} </div>;
   },
   _eventListenerThreshold: function(e){
    clearTimeout(resizeId);
    resizeId = setTimeout(this._handleThresholdChange(e), 100);
   },
   _handleThresholdChange: function( e ) {
     InsightActions.selectThreshold(e.target.value);
   }

});

module.exports = InsightThresholdSlider;
