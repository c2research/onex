var React = require('react');

/**
 * The control panel containing all the options and queries etc
 */
var InsightControlPanel = React.createClass({
   render: function() {

     var panelJSX = this.props.visible ?
       <div className="controlPanel"
            height={this.props.height}
            width={this.props.width} >
       </div>
       : null;
     return <div> {panelJSX} </div>;
   }
});

module.exports = InsightControlPanel;
