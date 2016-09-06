var React = require('react');

var InsightStore = require('./../flux/stores/InsightStore');
var InsightConstants = require('./../flux/constants/InsightConstants');
var InsightActions = require('./../flux/actions/InsightActions');

var InsightBanner = require('./InsightBanner');
var InsightControlPanel = require('./InsightControlPanel')

var resizeId;

/**
 * Retrieve the current data from the store
 * @return {object}
 */
function getState() {
  return {
    data: InsightStore.getStateData(),
    controlPanelVisible: InsightStore.getControlPanelVisible()
  };
}


/**
 * The InsightPlatform will layout the framework of the app, and action
 * as the view controller. All changes will cascade down from here through
 * props to children nodes.
 */
var InsightPlatform = React.createClass({
  /**
   * Gets the initial data for the state of the app
   */
  getInitialState: function() {
    return getState();
  },
  /**
   * Event handler for 'change' events coming from the InsightStore
   * This will refresh the appropriate state values from the store
   */
   _onChange: function() {
     this.setState(getState());
   },
   componentWillMount: function() {
     //set initial state values
     this.setState(getState());
   },
   componentDidMount: function() {
     //add event for resizing
     window.addEventListener('resize', this._eventListenerResize);

     //listen for changes from store (flux)
     InsightStore.addChangeListener(this._onChange);
   },
   componentWillUnmount: function() {
     //remove change listener
     window.removeEventListener('resize');

     //stop listening for changes from store (flux)
     InsightStore.removeChangeListener(this._onChange);
   },
   render: function() {
     var visible = this.state.controlPanelVisible;

     return (
       <div className="insightPlatform">
         <InsightBanner baseTitle="insight" />
         <InsightControlPanel visible={visible} height="500px" width="300px" />
       </div>
     );
   },

   /** private functions **/
   /**
    * Called when the window is resized
    */
   _eventListenerResize: function(){
    clearTimeout(resizeId);
    resizeId = setTimeout(this._onResizeAction, 100);
   },
   /**
    * user stopped resizing, go!
    */
   _onResizeAction: function(){
     InsightActions.resizeApp();
   }
});

module.exports = InsightPlatform;
