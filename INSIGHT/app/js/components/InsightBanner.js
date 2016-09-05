var React = require('react');

/**
 * The title and banner across the top of the application, (initially just a title)
 */
var InsightBanner = React.createClass({
   render: function() {
     var title = this.props.baseTitle;
     return (
       <div className="insightBanner">
        <h1 className="insightBanner"> {title} </h1>
       </div>
      );
   }
});

module.exports = InsightBanner;
