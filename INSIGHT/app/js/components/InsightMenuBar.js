var React = require('react');
var InsightActions = require('./../flux/actions/InsightActions');
var InsightButton = require('./InsightButton');
var AnnotatedSlider = require('./AnnotatedSlider');

var resizeId;



/**
 * This dropdown will have all the datasets
 */
var InsightMenuBar = React.createClass({
   renderDTWSlider: function() {
     var style =  {
       slider: {
         marginRight: 7,
         marginLeft: 10,
         height: 75,
         width: 7,
         WebkitAppearance: 'slider-vertical',  //chrome
         WritingMode: 'bt-lr' //ie lol
         //orient=vertical //firefox (html not css)
       },
       icon: {

       }
     }

     return <div style={style.icon}>
             <input
               type="range"
               style={style.slider}
               max={5}
               min={-5}
               step={1}
               value={this.props.DTWBias}
               onChange={this._updateDTWBias}/>
            </div>
   },
   render: function() {
     var style = {
       menuBar: {
         height: this.props.height,
         width: this.props.width,
         background: '#f2f2f2'
       }
     }
     var SliderJSX = this.props.results ? this.renderDTWSlider() : null;

     return (<div style={style.menuBar}>
      {SliderJSX}
     </div>);
   },
   _updateDTWBias: function(e) {
     InsightActions.updateDTWBias(e.target.value);
   }
});

module.exports = InsightMenuBar;
