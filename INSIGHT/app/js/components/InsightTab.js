var React = require('react');
var InsightActions = require('./../flux/actions/InsightActions');
var InsightConstants = require('./../flux/constants/InsightConstants');


/**
 * This is the 'fake' tab button across the top
 */
var InsightTab = React.createClass({
   render: function() {

     var selected = (this.props.type == this.props.current) ? " selected" : " notselected";
     var innerStyle = "tabSingleContent";
     var outerStyle = "tabSingleWrapper" + selected;

     var title;

     switch (this.props.type) {
       case InsightConstants.VIEW_MODE_SIMILARITY:
         title = "Similarity"
         break;
       case InsightConstants.VIEW_MODE_SEASONAL:
         title = "Seasonal"
         break;
       default:
         //no op - mode not supported
     }

     var tabJSX =
     <div className={outerStyle} onClick={this._handleClick} >
       <div className={innerStyle}>
          <h3 className={selected}>{title}</h3>
       </div>
     </div>

     return tabJSX;
   },
   _handleClick: function( e ) {
     InsightActions.selectViewMode(this.props.type);
   }
});

module.exports = InsightTab;
