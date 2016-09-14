var React = require('react');
var Select = require('react-select');
var InsightActions = require('./../flux/actions/InsightActions');

var resizeId;

/**
 * This dropdown will have all the datasets
 */
var InsightQuerySlider = React.createClass({
   getInitialState () {
     return {};
   },
   render: function() {
     var placeholder = "choose from the dataset";

     var panelJSX = this.props.dsCurrentLength > 0 ?
     <div>
       <input
          id="slider1"
          type="range"
          width="140px"
          max={this.props.dsCurrentLength - 1}
          min={0}
          step={1}
          value={this.props.qSeq}
          onChange={this._handleQueryChange}/>
        <output id="range1">{this.props.qSeq}</output>
      </div> : null;

     return panelJSX;
   },
   _handleQueryChange: function( e ) {
     InsightActions.selectQuery(e.target.value);
   }
});


module.exports = InsightQuerySlider;
