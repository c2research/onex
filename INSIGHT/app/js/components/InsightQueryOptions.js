var React = require('react');
var InsightActions = require('./../flux/actions/InsightActions');
var InsightConstants = require('./../flux/constants/InsightConstants');
var AnnotatedSlider = require('./AnnotatedSlider');

var resizeId;

/**
 * This is for the start and end
 * TODO: implement
 */
var InsightQueryOptions = React.createClass({
   render: function() {

     var startSliderJSX =
     <div >
        <h4> Select a starting data point </h4>
        <div className="options">
          <AnnotatedSlider
            width={200}
            value={this.props.qStart}
            min={0}
            max={this.props.qEnd}
            step={1}
            onChange={this._handleClickStart}/>
         </div>
     </div>;
     var endSliderJSX =
     <div >
        <h4> Select the end data point </h4>
        <div className="options">
          <AnnotatedSlider
            width={200}
            value={this.props.qEnd}
            min={this.props.qStart}
            max={this.props.qValues.length}
            step={1}
            onChange={this._handleClickEnd}/>
         </div>
     </div>;

     var queryOptionsJSX = this.props.qValues.length > 0 ?
     <div id="optionsContainer">
      {startSliderJSX}
      {endSliderJSX}
     </div> : null;

     return queryOptionsJSX;
   },
   _handleClickStart: function(e){
     resizeId = setTimeout(this._onResizeStartAction(e), 75);
   },
   _handleClickEnd: function(e){
     resizeId = setTimeout(this._onResizeEndAction(e), 75);
   },


   /**
    * fire event when start is chosen!
    */
   _onResizeStartAction: function(e){
     InsightActions.selectStartQ(parseInt(e.target.value, 10));
   },
   /**
    * fire event when end is chosen!
    */
   _onResizeEndAction: function(e){
     InsightActions.selectEndQ(parseInt(e.target.value, 10));
   }
});

module.exports = InsightQueryOptions;
