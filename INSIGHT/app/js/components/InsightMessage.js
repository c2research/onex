var React = require('react');
var InsightActions = require('./../flux/actions/InsightActions');

var resizeId;

/**
 * This dropdown will have all the datasets
 */
var InsightMessage = React.createClass({
   getInitialState: function() {
     return { focused: false };
   },
   componentWillMount: function() {
     this.setState({ focused: false });
   },
   willRecieveProps: function(){
     this.setState({ focused: false });
   },
   getDefaultProps: function(){
     return {
       icon: 'thumbs-o-up',
       color: '#2daf89',
       iconColor: '#efefef',
       title: 'Welcome to Insight',
       message: 'Click the question icon for a quick tour!',
       visibility: false
     }
   },
   render: function() {
     var iconClassName = "fa fa-"+ this.props.icon + " fa-2x";
     var shadowColor = this.state.focused && '#e2b6b3' || '#2daf89';
     var style = {
       component: {
         position: 'absolute',
         top: 25,
         right: 25,
         width: 350,
         opacity: 1,
         zIndex: 999999,
         backgroundColor: '#efefef',
         borderRadius: 4,
         boxShadow: '0px 1px 2px 0px ' + shadowColor
       },
       sidebar: {
         width: '100%',
         height: '100%',
         backgroundColor: this.props.color
       },
       topbar: {

       },
       messageArea: {

       },
       title: {

       },
       floatL: {
         float: 'left',
         width: '13%',

       },
       floatR: {
         float: 'right',
         width: '87%',

       },
       inner: {
         marginLeft: 7
       },
       wrapper: {
         display: 'flex',
         overflow: 'hidden',
       },
       icon: {
         color: this.props.iconColor,
         padding: 7
       }
     }

     return this.props.visibility &&
     <div style={style.component}
          onClick={this._closeMessage}
          onMouseEnter={(event) => this.setState({'focused': true})}
          onMouseLeave={(event) => this.setState({'focused': false})} >
        <div style={style.wrapper}>
            <div style={style.floatL}>
                <div style={style.sidebar}>
                  <i className={iconClassName} style={style.icon}></i>
                </div>
            </div>
            <div style={style.floatR}>
                <div style={style.inner}>
                    <div style={style.topbar}>
                        <h2 style={style.title}> {this.props.title} </h2>
                    </div>
                    <div style={style.messageArea}>
                      {this.props.message}
                    </div>
                </div>
            </div>
        </div>
     </div>;
   },
   _closeMessage: function() {
     InsightActions.sendMessage(['','','','','', false]);
   }
});

module.exports = InsightMessage;
