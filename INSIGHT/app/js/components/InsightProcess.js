var React = require('react');
var InsightActions = require('./../flux/actions/InsightActions');
var InsightConstants = require('./../flux/constants/InsightConstants')
var InsightButton = require('./InsightButton');

var resizeId;

/**
 * This dropdown will have all the datasets
 */
var InsightProcess = React.createClass({
   render: function() {
     var iconLoadingJSX;

     var style = {
       loading: {
         color: "#ea8f71"  //org
       },
       loaded: {
         color: "#58768f" //"#2daf89"  //green
       },
       ready: {
         color: "#58768f"  //blue
       },
       notReady: {
         color: "Gray"
       },
       icon: {
         float: "left",
         width: 20 + "%"
       },
       button: {
         float: "left",
         width: 80 + "%",
       },
       container: {
         width: 100 + "%"
       },
       clear: {
         clear: "both"
       }
     }

     switch (this.props.datasetIconMode) {
       case InsightConstants.ICON_DATASET_INIT_LOADING:
         iconLoadingJSX = <i style={style.loading} className="fa fa-spinner fa-spin fa-2x fa-fw"></i>;
         break;
       case InsightConstants.ICON_DATASET_INIT_LOADED:
         iconLoadingJSX = <i style={style.loaded} className="fa fa-check fa-2x" aria-hidden="true"></i>;
         break;
       case InsightConstants.ICON_DATASET_INIT_NULL:
       if (this.props.dsCollectionIndex != null) iconLoadingJSX = <i style={style.ready} className="fa fa-wrench fa-2x" aria-hidden="true"></i>;
       else iconLoadingJSX = <i style={style.notReady} className="fa fa-wrench fa-2x" aria-hidden="true"></i>;
       break;
     }

     var ProcessJSX =
     <div className = "panel">
     <h4> Finalize and Process Dataset </h4>
     <div style={style.container}>
      <div style={style.icon}>
      {iconLoadingJSX}
      </div>
      <div style={style.button}>
      <InsightButton text="Process Dataset" onClick={this._eventListenerClick} />
      </div>
      <div style={style.clear}> </div>
     </div>
     </div>;

     return ProcessJSX;
   },
   _eventListenerClick: function(){
    clearTimeout(resizeId);
    resizeId = setTimeout(this._handleClickAction, 100);
   },
   _handleClickAction: function( e ) {
     InsightActions.requestDatasetInit();
   }
});

module.exports = InsightProcess;
