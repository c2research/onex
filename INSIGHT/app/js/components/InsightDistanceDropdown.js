var React = require('react');

/**
 * This dropdown will have all the distance functions (and will be hidden initially)
 */
var InsightDistanceDropdown = React.createClass({
   render: function() {
     var divStyle = {width: this.props.width};

     var distanceList = this.props.distanceList;
     var distanceCurrentIndex = this.props.distanceCurrentIndex;

     var list = ["Dynamic Timewarping", "Markov", "Generalized Dynamic Timewarping", "Euclidean"];

     var optionsJSX = null;
     //list.map(function(opt){
     //   return <input type="radio" value={opt} key={opt}></input>;
     //});

     var panelJSX =
     <div className="section">
        <h2> Distance </h2>
        {optionsJSX}
     </div>;

     return <div> {panelJSX} </div>;
   }
});

module.exports = InsightDistanceDropdown;
