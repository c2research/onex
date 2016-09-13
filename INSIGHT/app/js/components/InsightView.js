var React = require('react');
var ReactDOM = require('react-dom');

/**
 * This is a prototype for an initial view
 * react manages structure
 * d3 manaages attributes
 * NOTE: this is currently just a basic outline of general d3/react nodes
 */
var InsightView = React.createClass({
   render: function() {
     var data = this.props.result;
     
     return <div id="containerD3"> </div>
   }
});


module.exports = InsightView;
