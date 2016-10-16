var React = require('react');

/**
 * Place this above a input slider to annotate it
 * TODO: consider only showing it for a short while (only while value being changed)
 * TODO: style div and create an upside down arrow!
 * TODO: fine tune calculation
 * width = the width of the slider beneath it
 * value = the value of the slider beanth it
 * max = the max value of the slider beneath it
 */
var AnnotatedSlider = React.createClass({
   getDefaultProps: function() {
     return {
       width: 200,
       height: 8
     };
   },
   render: function() {
     var left = (this.props.width * ((this.props.value - this.props.min) / (this.props.max - this.props.min)));
     var style = {
       container: {
         width: this.props.width
       },
       annotation: {
         width: 21,
         paddingLeft:  left
       },
       slider: {
         marginLeft: 0,
         marginRight: 0,
         width: this.props.width,
         height: this.props.height
       }
     }
     var sliderAnnotationJSX =
     <div style={style.annotation}>
      <output> {this.props.value} </output>
     </div>;

     var annotatedSliderJSX =
     <div style={style.container}>
      {sliderAnnotationJSX}
      <input
        type="range"
        style={style.slider}
        max={this.props.max}
        min={this.props.min}
        step={this.props.step}
        value={this.props.value}
        onChange={this.props.onChange}/>
     </div>

     return annotatedSliderJSX;
   }
});

module.exports = AnnotatedSlider;
